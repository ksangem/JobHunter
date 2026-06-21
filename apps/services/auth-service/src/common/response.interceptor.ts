// ============================================================================
// Global response envelope (Tech Specs §8 — API contract).
// Wraps every successful handler return into:
//   { data, meta: { timestamp, request_id, version }, error: null }
// ============================================================================
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseEnvelope<T> {
  data: T;
  meta: { timestamp: string; request_id: string; version: string };
  error: null;
}

const API_VERSION = 'v1';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseEnvelope<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ResponseEnvelope<T>> {
    const req = context.switchToHttp().getRequest();
    // Honour an inbound correlation id; otherwise mint one.
    const requestId: string =
      req?.headers?.['x-request-id'] ?? req?.id ?? randomUUID();

    return next.handle().pipe(
      map((data) => ({
        data,
        meta: {
          timestamp: new Date().toISOString(),
          request_id: requestId,
          version: API_VERSION,
        },
        error: null,
      })),
    );
  }
}
