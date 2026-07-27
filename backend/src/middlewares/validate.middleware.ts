import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/apiError';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string[]> = {};
        error.issues.forEach((issue) => {
          const key = issue.path.join('.') || 'body';
          if (!formattedErrors[key]) formattedErrors[key] = [];
          formattedErrors[key].push(issue.message);
        });
        return next(new ApiError(400, 'Validation Error', formattedErrors));
      }
      next(error);
    }
  };
};
