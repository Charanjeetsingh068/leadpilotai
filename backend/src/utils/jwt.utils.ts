import jwt, { SignOptions } from 'jsonwebtoken';
import { ENV } from '../config/env';

export interface TokenPayload {
  userId: string;
  role: string;
  organizationId: string;
  permissions?: string[];
}

export const signAccessToken = (payload: TokenPayload): string => {
  const options: SignOptions = { expiresIn: '15m' };
  return jwt.sign(payload, ENV.JWT_SECRET, options);
};

export const signRefreshToken = (payload: { userId: string }): string => {
  const options: SignOptions = { expiresIn: '7d' };
  return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, options);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, ENV.JWT_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, ENV.JWT_REFRESH_SECRET) as { userId: string };
};
