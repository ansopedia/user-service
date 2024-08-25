import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { envConstants } from '@/constants';

const { DATABASE_URL, NODE_ENV } = envConstants;

const dbOptions = {
  dbName: 'users-service',
};

export const connectDB = async () => {
  if (NODE_ENV === 'development') {
    mongoose.set('debug', true);
    await mongoose.connect(DATABASE_URL, dbOptions);
    return;
  }

  if (NODE_ENV === 'test') {
    const mongoMemoryServer = await MongoMemoryServer.create();
    const mongoUri = mongoMemoryServer.getUri();
    await mongoose.connect(mongoUri, dbOptions);
    return;
  }

  if (NODE_ENV === 'production') {
    await mongoose.connect(DATABASE_URL, dbOptions);
  }
};
