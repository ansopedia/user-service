import type { ObjectId, SocketUser } from "@ansospace/types";

class ConnectionManager {
  private connectedUsers: Map<ObjectId, SocketUser>;

  constructor() {
    this.connectedUsers = new Map();
  }

  addUser(userId: ObjectId, socketId: string) {
    this.connectedUsers.set(userId, { userId, socketId });
  }

  removeUser(userId: ObjectId) {
    this.connectedUsers.delete(userId);
  }

  getConnectedUsers() {
    return Array.from(this.connectedUsers.values());
  }

  isUserConnected(userId: ObjectId) {
    return this.connectedUsers.has(userId);
  }
}

export const connectionManager = new ConnectionManager();
