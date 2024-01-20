import mongoose from 'mongoose';
import { IDatabaseConnector } from './interface/database.interface';

export class MongoDBConnector implements IDatabaseConnector {
  private options: Record<string, string>;

  constructor(
    readonly connectionStr: string,
    options: Record<string, string>,
  ) {
    this.connectionStr = connectionStr;
    this.options = options;
  }

  async connect(): Promise<void> {
    await mongoose.connect(this.connectionStr, this.options);
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }
}
