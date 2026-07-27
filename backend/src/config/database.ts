import mongoose from 'mongoose';
import { ENV } from './env';
import { seedInitialAdminUser } from './seed';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const connectDatabase = async (): Promise<void> => {
  try {
    let mongoUri = ENV.MONGO_URI;

    if (ENV.NODE_ENV === 'development' || mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1')) {
      console.log('[Database] Starting in-memory MongoDB server for development...');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log(`[Database] In-memory MongoDB server started at: ${mongoUri}`);
    }

    await mongoose.connect(mongoUri);
    console.log('[Database] MongoDB Connected Successfully');
    await seedInitialAdminUser();
  } catch (error) {
    console.error('[Database] MongoDB Connection Error:', error);
    process.exit(1);
  }
};
