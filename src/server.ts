import http from "http";
import { Server as SocketIOServer } from "socket.io";

import { app } from "./app";
import { initializeSocket } from "./config";
import { logger } from "./utils";
import { CryptoUtil } from "./utils/crypto.util";

const server = http.createServer(app);
let io: SocketIOServer | undefined;

// Initialize crypto keys
const initializeCryptoKeys = async () => {
  try {
    const cryptoUtil = CryptoUtil.getInstance();
    await cryptoUtil.loadKeys();
    logger.info("Crypto keys loaded successfully");
  } catch (error) {
    logger.error("Failed to load crypto keys:", error);
    process.exit(1); // Exit if we can't load the keys
  }
};

// Call this before starting your server
export const startServer = async (port: number): Promise<void> => {
  await initializeCryptoKeys();
  return new Promise((resolve, reject) => {
    try {
      server.listen(port, () => {
        // Initialize Socket.IO
        io = initializeSocket(server);

        logger.info(`🚀 Server is running on port ${port}`);
        resolve();
      });

      server.on("error", (error) => {
        logger.error("Server error:", error);
        reject(error);
      });
    } catch (error) {
      logger.error("Failed to start server:", error);
      reject(error);
    }
  });
};

export const stopServer = (): Promise<void> => {
  logger.info("Server is shutting down...");

  return new Promise((resolve, reject) => {
    if (io) {
      io.close();
    }

    server.close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export default app;
