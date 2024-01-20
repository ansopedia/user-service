import { DATABASE_URI } from '../constants';
import { DatabaseService } from '../services';
import { MongoDBConnector } from '../database/MongoDBConnector';

const DB_OPTIONS = {
  dbName: 'ansopedia-user',
};

export const db = DatabaseService.getInstance(new MongoDBConnector(DATABASE_URI, DB_OPTIONS));
