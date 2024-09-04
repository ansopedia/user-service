import mongoose from 'mongoose';
// import { MongoMemoryServer } from 'mongodb-memory-server';
import { envConstants, ErrorTypeEnum } from '@/constants';
import { logger } from '../utils';

const { DATABASE_URL, NODE_ENV } = envConstants;

const dbOptions = {
  dbName: 'users-service',
};

export const connectDB = async () => {
  try {
    if (NODE_ENV === 'development') {
      mongoose.set('debug', true);
      await mongoose.connect(DATABASE_URL, dbOptions);
      return;
    }

    if (NODE_ENV === 'test') {
      // const mongoMemoryServer = await MongoMemoryServer.create();
      // const mongoUri = mongoMemoryServer.getUri();
      // await mongoose.connect(mongoUri, dbOptions);

      await mongoose.connect(DATABASE_URL, dbOptions);

      return;
    }

    if (NODE_ENV === 'production') {
      await mongoose.connect(DATABASE_URL, dbOptions);
    }
  } catch (error) {
    logger.error(error);
    throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
};
