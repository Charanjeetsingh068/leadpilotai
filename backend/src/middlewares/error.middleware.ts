import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error.util';
import { createApiResponse } from '../interfaces/api-response.interface';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const errorCode = err instanceof AppError ? err.errorCode : 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred';

  res.status(statusCode).json(
    createApiResponse(
      false,
      undefined,
      message,
      {
        code: errorCode,
        details: err.details || null,
      }
    )
  );
}

export const errorMiddleware = errorHandler;
