import mongoose from 'mongoose';
import { disconnectDB } from './config';

afterAll(async () => {
  // Delete all test collections
  await mongoose.connection.db?.dropDatabase();

  await disconnectDB();
});
