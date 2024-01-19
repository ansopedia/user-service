import { MongoClient } from 'mongodb';
import { IDatabaseConnector } from './database.interface';

export interface IMongoDBConnector extends IDatabaseConnector {
  client: MongoClient;
}
