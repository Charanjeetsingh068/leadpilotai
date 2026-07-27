export type UserRole = 'PLATFORM_OWNER' | 'CLIENT_ADMIN' | 'SALES_EXECUTIVE';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  avatarUrl?: string;
  phone?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

