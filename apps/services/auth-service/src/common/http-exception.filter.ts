// ============================================================================
// Global exception filter producing RFC 7807 "problem+json" error bodies.
// Shape: { type, title, status, detail, instance, request_id, errors? }
// ============================================================================
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { createLogger } from '@jobhunter/logger';

const logger = createLogger('auth-service');

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let title = 'Internal Server Error';
    let detail: string | undefined;
    let errors: unknown;

    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      if (typeof body === 'string') {
        title = body;
      } else if (body && typeof body === 'object') {
        const b = body as Record<string, unknown>;
        title = (b.error as string) ?? exception.name;
        // class-validator returns message as string[]
        if (Array.isArray(b.message)) {
          detail = (b.message as string[]).join('; ');
          errors = b.message;
        } else {
          detail = b.message as string;
        }
      }
    } else if (exception instanceof Error) {
      detail = exception.message;
    }

    const requestId: string = req?.headers?.['x-request-id'] ?? randomUUID();

    // Never leak internals on 5xx. Log full error, return generic detail.
    if (status >= 500) {
      logger.error({ err: exception, request_id: requestId }, 'unhandled exception');
      detail = 'An unexpected error occurred.';
    }

    res.status(status).type('application/problem+json').json({
      type: `https://docs.jobhunter.io/errors/${status}`,
      title,
      status,
      detail,
      instance: req?.url,
      request_id: requestId,
      ...(errors ? { errors } : {}),
    });
  }
}
