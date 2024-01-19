import { DATABASE_URI } from '../constants';
import { MongoDBConnector } from '../database/MongoDBConnector';
import { DatabaseService } from '../services';

export const db = DatabaseService.getInstance(new MongoDBConnector(DATABASE_URI));
