import { DATABASE_URI } from '../constants';
import { DatabaseServiceProvider } from '../services';
import { MongoDBConnector } from '../database/MongoDBConnector';
import { logger } from '../utils';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { NODE_ENV } from '../constants';

const DB_OPTIONS = {
  dbName: 'ansopedia-user',
};

async function getDatabaseConnection() {
  let db: DatabaseServiceProvider | null = null;

  if (NODE_ENV === 'production' || NODE_ENV === 'development') {
    if (!DATABASE_URI) {
      logger.error('DATABASE_URI is not defined');
    }

    db = DatabaseServiceProvider.getInstance(
      new MongoDBConnector(DATABASE_URI, DB_OPTIONS),
    );
  }

  if (NODE_ENV === 'test') {
    const mongoMemoryServer = await MongoMemoryServer.create();
    const mongoUri = mongoMemoryServer.getUri();
    db = DatabaseServiceProvider.getInstance(
      new MongoDBConnector(mongoUri, DB_OPTIONS),
    );
  }

  return db?.connect();
}

export default getDatabaseConnection;
