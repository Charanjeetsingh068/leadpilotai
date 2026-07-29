import { PrismaClient } from '@prisma/client';
import { seedInitialData } from './seed';

export const prisma = new PrismaClient();

export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('[Database] PostgreSQL Connected Successfully');
    await seedInitialData();
  } catch (error) {
    console.error('[Database] PostgreSQL Connection Error:', error);
    // In local development, we print the warning but don't crash, allowing the user to configure credentials.
    console.warn('[Database] Running without active PostgreSQL connection. Please configure credentials in backend/.env');
  }
};
