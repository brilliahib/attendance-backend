import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IWrappedResponse } from '../interfaces/response.interface';
import { Response } from 'express';

type AnyObj = Record<string, any>;

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  IWrappedResponse<T | null> & AnyObj
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<IWrappedResponse<T | null> & AnyObj> {
    const httpResponse = context.switchToHttp().getResponse<Response>();
    const statusCode = httpResponse.statusCode;

    return next.handle().pipe(
      map((res: unknown) => {
        let data: T | null = null;
        let message: string | undefined;
        const extras: AnyObj = {};

        if (res === null || res === undefined) {
          data = null;
        } else if (typeof res === 'object' && res !== null) {
          const r = res as AnyObj;
          if (typeof r.message === 'string') message = r.message;
          if ('pagination' in r) extras.pagination = r.pagination;
          if ('data' in r) {
            data = (r.data as T) ?? null;
          } else {
            data = r as T;
          }
        } else {
          data = res as T;
        }

        return {
          meta: {
            status: statusCode >= 200 && statusCode < 300 ? 'success' : 'error',
            statusCode,
            message:
              message ??
              (statusCode >= 200 && statusCode < 300 ? 'OK' : 'Error'),
          },
          data,
          ...extras,
        };
      }),
    );
  }
}
