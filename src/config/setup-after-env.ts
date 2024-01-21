import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoMemoryServer: MongoMemoryServer;

beforeAll(async () => {
  mongoMemoryServer = await MongoMemoryServer.create();
  const mongoUri = mongoMemoryServer.getUri();

  await mongoose.connect(mongoUri, {});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoMemoryServer.stop();
});
