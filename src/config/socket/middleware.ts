import { type AccessTokenPayload, TokenType } from "@ansospace/types";
import { Server } from "socket.io";

import type { CustomSocket } from "@/types";
import { logger, verifyJWTToken } from "@/utils";

export const setupSocketMiddleware = (io: Server) => {
  io.use(async (socket: CustomSocket, next) => {
    try {
      // 1. Extract token from connection request
      const { token } = socket.handshake.auth;

      if (typeof token !== "string") {
        throw new Error("Authentication token required");
      }

      // 2. Validate token
      const decoded = await verifyJWTToken<AccessTokenPayload>(token, TokenType.AUTHORIZATION);

      // 3. Attach user data to socket
      socket.data.userId = decoded.userId;
      logger.info(`Socket authenticated for user: ${decoded.userId}`);
      next();
    } catch (error) {
      next(error as Error);
    }
  });
};
