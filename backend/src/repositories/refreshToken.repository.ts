import { RefreshTokenModel, IRefreshTokenDocument } from '../models/RefreshToken.model';
import crypto from 'crypto';

export class RefreshTokenRepository {
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async saveToken(
    userId: string,
    token: string,
    expiresAt: Date,
    ipAddress?: string,
    deviceInfo?: string
  ): Promise<IRefreshTokenDocument> {
    const tokenHash = this.hashToken(token);
    return RefreshTokenModel.create({
      userId,
      tokenHash,
      expiresAt,
      ipAddress,
      deviceInfo,
    });
  }

  async findValidToken(userId: string, token: string): Promise<IRefreshTokenDocument | null> {
    const tokenHash = this.hashToken(token);
    return RefreshTokenModel.findOne({
      userId,
      tokenHash,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    });
  }

  async revokeToken(userId: string, token: string): Promise<boolean> {
    const tokenHash = this.hashToken(token);
    const result = await RefreshTokenModel.updateOne(
      { userId, tokenHash },
      { $set: { isRevoked: true } }
    );
    return result.modifiedCount > 0;
  }

  async revokeAllUserTokens(userId: string): Promise<number> {
    const result = await RefreshTokenModel.updateMany(
      { userId, isRevoked: false },
      { $set: { isRevoked: true } }
    );
    return result.modifiedCount;
  }
}
