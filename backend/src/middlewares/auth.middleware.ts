import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { verifyAccessToken } from '../utils/jwt.utils';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    organizationId: string;
    permissions?: string[];
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Unauthorized: Missing or invalid token'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.userId,
      role: payload.role,
      organizationId: payload.organizationId,
      permissions: payload.permissions || [],
    };
    next();
  } catch {
    return next(new ApiError(401, 'Unauthorized: Token expired or invalid'));
  }
};
