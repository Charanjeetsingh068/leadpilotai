import { Response } from 'express';

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  meta?: Record<string, unknown>
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};
