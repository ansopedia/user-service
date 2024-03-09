import mongoose from 'mongoose';
import { connectDB } from '../connection';

describe('connectDB function', () => {
  beforeEach(async () => {
    await mongoose.disconnect();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should connect to in-memory MongoDB server in test environment', async () => {
    await connectDB();
    expect(mongoose.connection.readyState).toBe(mongoose.STATES.connected);
  });
});
