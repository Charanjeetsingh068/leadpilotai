import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { ApiError } from '../utils/apiError';

export const permissionMiddleware = (requiredPermissions: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.permissions) {
      return next(new ApiError(403, 'Forbidden: Permission access denied'));
    }

    const hasAll = requiredPermissions.every((perm) => req.user?.permissions?.includes(perm));

    if (!hasAll) {
      return next(new ApiError(403, 'Forbidden: Insufficient permissions'));
    }

    next();
  };
};
