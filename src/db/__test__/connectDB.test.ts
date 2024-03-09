import mongoose from 'mongoose';
import { connectDB } from '../connection';

describe('Test Connection', () => {
  beforeEach(async () => {
    await mongoose.disconnect();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('Should connect to in-memory MongoDB server in test environment', async () => {
    await connectDB();
    expect(mongoose.connection.readyState).toBe(mongoose.STATES.connected);
  });
});
