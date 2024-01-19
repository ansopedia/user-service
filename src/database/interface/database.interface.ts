export interface IDatabaseConnector {
  client: unknown;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
