import { UserModel, IUserDocument } from '../models/User.model';

export class UserRepository {
  async findByEmail(email: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ email: email.toLowerCase() });
  }

  async findById(id: string): Promise<IUserDocument | null> {
    return UserModel.findById(id);
  }

  async findByIdWithRoleAndPermissions(id: string): Promise<IUserDocument | null> {
    return UserModel.findById(id).populate({
      path: 'roleId',
      populate: { path: 'permissions' },
    });
  }

  async updateLastLogin(id: string): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { $set: { lastLoginAt: new Date() } });
  }

  async setPasswordResetToken(id: string, token: string, expires: Date): Promise<void> {
    await UserModel.findByIdAndUpdate(id, {
      $set: { passwordResetToken: token, passwordResetExpires: expires },
    });
  }

  async resetPassword(id: string, newPasswordHash: string): Promise<void> {
    await UserModel.findByIdAndUpdate(id, {
      $set: { passwordHash: newPasswordHash },
      $unset: { passwordResetToken: 1, passwordResetExpires: 1 },
    });
  }
}
