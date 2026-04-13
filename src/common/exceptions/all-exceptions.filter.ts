import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { IWrappedError } from '../interfaces/error-response.interface';
import { ValidationError } from 'class-validator';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: { field: string; messages: string[] }[] | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (exception instanceof BadRequestException && typeof res === 'object') {
        const responseBody = res as Record<string, any>;

        if (Array.isArray(responseBody['message'])) {
          message = 'Validation failed';

          if (
            Array.isArray(responseBody['message']) &&
            responseBody['message'][0] instanceof Object &&
            'property' in responseBody['message'][0]
          ) {
            const validationErrors = responseBody[
              'message'
            ] as ValidationError[];

            errors = validationErrors.map((err) => ({
              field: err.property,
              messages: Object.values(err.constraints ?? {}),
            }));
          } else {
            const errorMap: Record<string, string[]> = {};

            for (const msg of responseBody['message'] as string[]) {
              const match = msg.match(/^(\w+)\s/);
              const field = match ? match[1].toLowerCase() : 'unknown';
              if (!errorMap[field]) errorMap[field] = [];
              errorMap[field].push(msg);
            }

            errors = Object.entries(errorMap).map(([field, messages]) => ({
              field,
              messages,
            }));
          }
        } else {
          message = responseBody['message'] || 'Error';
        }
      } else {
        message = (res as any)?.message || exception.message || 'Error';
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse: IWrappedError = {
      meta: {
        status: 'error',
        statusCode: status,
        message,
        ...(errors ? { errors } : {}),
      },
      data: null,
    };

    response.status(status).json(errorResponse);
  }
}
