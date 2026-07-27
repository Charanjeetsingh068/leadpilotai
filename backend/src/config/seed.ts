import { UserModel } from '../models/User.model';
import { hashPassword } from '../utils/password.utils';

export const seedInitialAdminUser = async () => {
  try {
    const existingUser = await UserModel.findOne({ email: 'charanjeet.s7730@gmail.com' });
    if (!existingUser) {
      const hashedPassword = await hashPassword('123456');
      await UserModel.create({
        name: 'Charanjeet Singh',
        email: 'charanjeet.s7730@gmail.com',
        passwordHash: hashedPassword,
        role: 'CLIENT_ADMIN',
        organizationId: 'org_leadpilot_demo',
        isActive: true,
      });
      console.log('[Seed] Admin user charanjeet.s7730@gmail.com created successfully.');
    }
  } catch (error) {
    console.error('[Seed] Failed to seed initial user:', error);
  }
};
