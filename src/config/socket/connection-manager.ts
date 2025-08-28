import { type MongooseObjectId } from "@/types";
import type { SocketUser } from "@/types/socket.types.js";

class ConnectionManager {
  private connectedUsers: Map<MongooseObjectId, SocketUser>;

  constructor() {
    this.connectedUsers = new Map();
  }

  addUser(userId: MongooseObjectId, socketId: string) {
    this.connectedUsers.set(userId, { userId, socketId });
  }

  removeUser(userId: MongooseObjectId) {
    this.connectedUsers.delete(userId);
  }

  getConnectedUsers() {
    return Array.from(this.connectedUsers.values());
  }

  isUserConnected(userId: MongooseObjectId) {
    return this.connectedUsers.has(userId);
  }
}

export const connectionManager = new ConnectionManager();
