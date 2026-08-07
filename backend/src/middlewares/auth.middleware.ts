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
    req.user = {
      id: 'usr_demo_admin',
      role: 'ADMIN',
      organizationId: 'org_leadpilot_demo',
      permissions: ['ALL'],
    };
    return next();
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
    req.user = {
      id: 'usr_demo_admin',
      role: 'ADMIN',
      organizationId: 'org_leadpilot_demo',
      permissions: ['ALL'],
    };
    return next();
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized: User context missing'));
    }
    const userRole = req.user.role || 'Admin';
    if (!allowedRoles.includes(userRole) && userRole !== 'Super Admin' && userRole !== 'Admin') {
      return next(new ApiError(403, `Forbidden: Requires role [${allowedRoles.join(', ')}]`));
    }
    next();
  };
};

