import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';

export const errorMiddleware = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    errors: err instanceof ApiError ? err.errors : undefined,
  });
};
