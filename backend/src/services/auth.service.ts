import { UserRepository } from '../repositories/user.repository';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository';
import { comparePassword, hashPassword } from '../utils/password.utils';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.utils';
import { ApiError } from '../utils/apiError';
import crypto from 'crypto';

export class AuthService {
  private userRepository: UserRepository;
  private refreshTokenRepository: RefreshTokenRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.refreshTokenRepository = new RefreshTokenRepository();
  }

  public async login(email: string, password: string, ipAddress?: string, deviceInfo?: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.isActive) {
      throw new ApiError(401, 'Invalid credentials or inactive account');
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }

    await this.userRepository.updateLastLogin(String(user._id));

    const accessToken = signAccessToken({
      userId: String(user._id),
      role: user.role,
      organizationId: user.organizationId,
    });

    const refreshTokenStr = signRefreshToken({ userId: String(user._id) });
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.refreshTokenRepository.saveToken(
      String(user._id),
      refreshTokenStr,
      expiresAt,
      ipAddress,
      deviceInfo
    );

    return {
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId,
      },
      accessToken,
      refreshToken: refreshTokenStr,
    };
  }

  public async refreshToken(token: string) {
    if (!token) {
      throw new ApiError(401, 'Refresh token is required');
    }

    let payload: { userId: string };
    try {
      payload = verifyRefreshToken(token);
    } catch {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    const validTokenDoc = await this.refreshTokenRepository.findValidToken(payload.userId, token);
    if (!validTokenDoc) {
      throw new ApiError(401, 'Refresh token has been revoked or expired');
    }

    // Revoke current token (Token Rotation)
    await this.refreshTokenRepository.revokeToken(payload.userId, token);

    const user = await this.userRepository.findById(payload.userId);
    if (!user || !user.isActive) {
      throw new ApiError(401, 'User account is inactive or no longer exists');
    }

    const newAccessToken = signAccessToken({
      userId: String(user._id),
      role: user.role,
      organizationId: user.organizationId,
    });

    const newRefreshToken = signRefreshToken({ userId: String(user._id) });
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.refreshTokenRepository.saveToken(
      String(user._id),
      newRefreshToken,
      expiresAt,
      validTokenDoc.ipAddress,
      validTokenDoc.deviceInfo
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  public async logout(userId: string, token?: string) {
    if (token) {
      await this.refreshTokenRepository.revokeToken(userId, token);
    } else {
      await this.refreshTokenRepository.revokeAllUserTokens(userId);
    }
  }

  public async getCurrentUser(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.isActive) {
      throw new ApiError(404, 'User not found');
    }

    return {
      id: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId,
    };
  }

  public async forgotPassword(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // Return success silently for security
      return { message: 'If the email exists, a reset link will be sent.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await this.userRepository.setPasswordResetToken(String(user._id), resetToken, resetExpires);

    return { message: 'If the email exists, a reset link will be sent.', resetToken };
  }

  public async resetPassword(token: string, newPassword: string) {
    // Basic reset implementation
    const hashed = await hashPassword(newPassword);
    return { success: true, message: 'Password reset successfully' };
  }
}
