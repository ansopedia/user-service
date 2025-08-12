import { Server, Socket } from "socket.io";

import { MongooseObjectId } from "./index";

export type UserConnectionEvent = {
  userId: MongooseObjectId;
  timestamp: number;
};

export type UserUpdateEvent = {
  userId: MongooseObjectId;
  updates: {
    field: string;
    value: unknown;
  }[];
};

export type NotificationEvent = {
  id: MongooseObjectId;
  type: "info" | "warning" | "error" | "success";
  message: string;
  timestamp: number;
};

export interface ServerToClientEvents {
  "user:connected": (event: UserConnectionEvent) => void;
  "user:disconnected": (event: UserConnectionEvent) => void;
  "user:updated": (event: UserUpdateEvent) => void;
  "notification:received": (event: NotificationEvent) => void;
  "role:updated": (data: { userId: MongooseObjectId; roles: string[] }) => void;
}

export interface ClientToServerEvents {
  "profile:update": (data: unknown) => void;
  "role:update": (data: { roles: string[] }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: MongooseObjectId;
}

export interface SocketUser {
  userId: MongooseObjectId;
  socketId: string;
}

export type CustomSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export type CustomServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
