import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
import { ENV } from './env';
import { seedInitialData } from './seed';

export const prisma = new PrismaClient();

export const connectDatabase = async (): Promise<void> => {
  // 1. PostgreSQL / Prisma Connection
  try {
    await prisma.$connect();
    console.log('[Database] PostgreSQL Connected Successfully');
    await seedInitialData();
  } catch (error) {
    console.warn('[Database] PostgreSQL Connection Notice: Running without active PostgreSQL database.');
  }

  // 2. MongoDB / Mongoose Connection with automatic MongoMemoryServer fallback
  const mongoUri = process.env.MONGO_URI || ENV.MONGO_URI || 'mongodb://localhost:27017/leadpilot';
  
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[Database] MongoDB Connected Successfully (${mongoUri})`);
  } catch (mongoErr: any) {
    console.warn(`[Database] Local MongoDB not reachable on ${mongoUri}. Starting in-memory MongoMemoryServer...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`[Database] MongoMemoryServer Connected Successfully (${uri})`);
    } catch (memErr: any) {
      console.error('[Database] MongoMemoryServer Error:', memErr.message);
    }
  }
};
