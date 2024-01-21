import { DATABASE_URI } from '../constants';
import { DatabaseService } from '../services';
import { MongoDBConnector } from '../database/MongoDBConnector';
import { logger } from '../utils';

const DB_OPTIONS = {
  dbName: 'ansopedia-user',
};

if (!DATABASE_URI) {
  logger.error('DATABASE_URI is not defined');
}

export const db = DatabaseService.getInstance(new MongoDBConnector(DATABASE_URI, DB_OPTIONS));
