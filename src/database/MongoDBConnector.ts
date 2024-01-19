import { MongoClient } from 'mongodb';

import { IMongoDBConnector } from './interface/mongoDB.interface';

export class MongoDBConnector implements IMongoDBConnector {
  public client: MongoClient;

  constructor(readonly connectionStr: string) {
    this.client = new MongoClient(connectionStr);
  }

  async connect(): Promise<void> {
    this.client = await this.client.connect();
  }

  public async disconnect(): Promise<void> {
    await this.client.close();
  }
}
