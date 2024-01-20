import { IDatabaseConnector } from '../database/interface/database.interface';

// Singleton pattern for DatabaseService class to ensure that only one instance of the class exists at any given time.
// Dependency injection is used to inject the database connector into the DatabaseService class.
export default class DatabaseService implements IDatabaseConnector {
  private static instance: DatabaseService | null = null;
  private database: IDatabaseConnector;

  private constructor(database: IDatabaseConnector) {
    this.database = database;
  }

  public static getInstance(database: IDatabaseConnector): DatabaseService | null {
    if (!this.instance) {
      this.instance = new DatabaseService(database);
    }
    return this.instance;
  }

  async connect(): Promise<void> {
    await this.database.connect();
  }

  async disconnect(): Promise<void> {
    await this.database.disconnect();
  }
}
