import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { envConstants } from '../constants';

const { DATABASE_URL, NODE_ENV } = envConstants;

export const connectDB = async () => {
  if (NODE_ENV === 'development') {
    mongoose.set('debug', true);
    await mongoose.connect(DATABASE_URL, {
      dbName: 'users-service',
    });
  }

  if (NODE_ENV === 'test') {
    const mongoMemoryServer = await MongoMemoryServer.create();
    const mongoUri = mongoMemoryServer.getUri();
    await mongoose.connect(mongoUri, {});
  }
};
