// Shared response envelope: { data, meta:{timestamp,request_id,version}, error }.
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, unknown> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const requestId = req?.headers?.['x-request-id'] ?? randomUUID();
    return next.handle().pipe(
      map((data) => ({
        data,
        meta: { timestamp: new Date().toISOString(), request_id: requestId, version: 'v1' },
        error: null,
      })),
    );
  }
}
