import type { CustomSocket } from "@/types/socket.types.js";
import { errorLogger, logger } from "@/utils";

export const setupEventHandlers = (socket: CustomSocket) => {
  const { userId } = socket.data;

  const handlers = {
    handleDisconnect: () => {
      logger.info(`User disconnected: ${userId}`);
      socket.broadcast.emit("user:disconnected", {
        userId,
        timestamp: Date.now(),
      });
    },

    handleError: (error: Error) => {
      errorLogger.error(`Socket error for user ${userId}; error: ${error}`);
    },
  };

  return handlers;
};
