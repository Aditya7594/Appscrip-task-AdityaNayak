import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface StandardErrorResponse {
  statusCode: number;
  error: string;
  message: string | string[];
  path: string;
  timestamp: string;
}

interface NestHttpExceptionPayload {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

interface ErrorWithStatus {
  status?: number;
  statusCode?: number;
  message?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
        this.logger.error(exception.stack ?? exception.message);
        message = 'Internal server error';
        error = HttpStatus[statusCode] ?? 'Internal Server Error';
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = HttpStatus[statusCode] ?? 'Http Exception';
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const payload = exceptionResponse as NestHttpExceptionPayload;
        if (payload.message) {
          message = payload.message;
        } else {
          message = exception.message;
        }
        error = payload.error ?? HttpStatus[statusCode] ?? 'Http Exception';
      } else {
        message = exception.message;
        error = HttpStatus[statusCode] ?? 'Http Exception';
      }
    } else if (this.isErrorWithStatus(exception)) {
      const parsedStatus = exception.status ?? exception.statusCode;
      if (typeof parsedStatus === 'number' && parsedStatus >= 400 && parsedStatus < 600) {
        statusCode = parsedStatus;
        error = HttpStatus[statusCode] ?? 'Bad Request';
        message = exception.message ?? 'Invalid request payload';
      } else {
        const errorDetails =
          exception instanceof Error
            ? exception.stack ?? exception.message
            : typeof exception === 'string'
              ? exception
              : JSON.stringify(exception);
        this.logger.error(errorDetails);
      }
    } else {
      const errorDetails =
        exception instanceof Error
          ? exception.stack ?? exception.message
          : typeof exception === 'string'
            ? exception
            : JSON.stringify(exception);
      this.logger.error(errorDetails);
    }

    const errorPayload: StandardErrorResponse = {
      statusCode,
      error,
      message,
      path: request.originalUrl ?? request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(errorPayload);
  }

  private isErrorWithStatus(error: unknown): error is ErrorWithStatus {
    return typeof error === 'object' && error !== null && ('status' in error || 'statusCode' in error);
  }
}
