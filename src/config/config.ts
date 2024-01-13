import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { logger } from '../utils/Logger';

dotenv.config();

const uri = process.env.DATABASE_URI ?? '';

const client = new MongoClient(uri);

async function connect() {
  try {
    await client.connect();
  } catch (err) {
    logger.error(`Failed to connect to MongoDB: ${(err as Error).message}`);
  }
}

export default connect;
