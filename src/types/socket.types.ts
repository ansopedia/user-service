import type { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "@ansospace/types";
import type { Server, Socket } from "socket.io";

export type CustomSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export type CustomServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
