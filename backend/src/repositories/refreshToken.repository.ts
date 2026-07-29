import { prisma } from '../config/database';

export class RefreshTokenRepository {
  async saveToken(
    userId: string,
    token: string,
    expiresAt: Date,
    ipAddress?: string,
    deviceInfo?: string
  ): Promise<any> {
    // Delete any expired sessions for this user to keep the table clean
    try {
      await prisma.userSession.deleteMany({
        where: {
          userId,
          expiresAt: { lte: new Date() },
        },
      });
    } catch (e) {
      // Ignored
    }

    return prisma.userSession.create({
      data: {
        userId,
        refreshToken: token,
        expiresAt,
      },
    });
  }

  async findValidToken(userId: string, token: string): Promise<any | null> {
    const session = await prisma.userSession.findFirst({
      where: {
        userId,
        refreshToken: token,
        expiresAt: { gt: new Date() },
      },
    });
    if (!session) return null;
    return {
      userId: session.userId,
      ipAddress: '',
      deviceInfo: '',
    };
  }

  async revokeToken(userId: string, token: string): Promise<boolean> {
    try {
      await prisma.userSession.delete({
        where: { refreshToken: token },
      });
      return true;
    } catch {
      return false;
    }
  }

  async revokeAllUserTokens(userId: string): Promise<number> {
    const result = await prisma.userSession.deleteMany({
      where: { userId },
    });
    return result.count;
  }
}
