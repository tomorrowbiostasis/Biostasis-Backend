import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { UNKNOWN_ERROR } from './keys';
import { CustomError } from './custom-error';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  protected readonly logger = new Logger(ExceptionsFilter.name);

  public catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const code =
      status !== HttpStatus.INTERNAL_SERVER_ERROR
        ? exception.message.message || exception.message || null
        : UNKNOWN_ERROR;

    const errorResponse = {
      error: {
        status,
        timestamp: new Date().toLocaleString(),
        path: request.url,
        method: request.method,
        code,
        message:
          status !== HttpStatus.INTERNAL_SERVER_ERROR
            ? exception.error
            : exception.message,
      },
    };
    if (process.env.NODE_ENV !== 'test' && status !== 404) {
      const stack =
        exception instanceof CustomError
          ? JSON.stringify(exception.error) || exception
          : exception.stack;
      this.logger.error(exception.message || null, stack);
    }

    response.status(status).json(errorResponse);
  }
}
