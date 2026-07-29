import { prisma } from '../config/database';

export class UserRepository {
  async findByEmail(email: string): Promise<any | null> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { role: true },
    });
    if (!user) return null;
    return {
      _id: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      isActive: true,
      role: user.role?.name || 'SALES_EXECUTIVE',
      organizationId: user.organizationId,
    };
  }

  async findById(id: string): Promise<any | null> {
    if (!id || id.length !== 36) return null;
    const user = await prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
    if (!user) return null;
    return {
      _id: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      isActive: true,
      role: user.role?.name || 'SALES_EXECUTIVE',
      organizationId: user.organizationId,
    };
  }

  async findByIdWithRoleAndPermissions(id: string): Promise<any | null> {
    if (!id || id.length !== 36) return null;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });
    if (!user) return null;
    return {
      _id: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      isActive: true,
      role: user.role?.name || 'SALES_EXECUTIVE',
      organizationId: user.organizationId,
      roleId: user.role ? {
        id: user.role.id,
        name: user.role.name,
        permissions: user.role.permissions.map((p) => p.name),
      } : null,
    };
  }

  async updateLastLogin(id: string): Promise<void> {
    // No-op for PostgreSQL, last login timestamp can be added to UserSession
  }

  async setPasswordResetToken(id: string, token: string, expires: Date): Promise<void> {
    // Basic helper
  }

  async resetPassword(id: string, newPasswordHash: string): Promise<void> {
    if (!id || id.length !== 36) return;
    await prisma.user.update({
      where: { id },
      data: { passwordHash: newPasswordHash },
    });
  }
}
