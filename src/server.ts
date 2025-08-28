import http from "http";
import { Server as SocketIOServer } from "socket.io";

import { initializeSocket } from "@/config";
import { envConstants } from "@/constants";
import { CryptoUtil, errorLogger, logger } from "@/utils";

import { app } from "./app.js";

const server = http.createServer(app);
let io: SocketIOServer | undefined;

// Initialize crypto keys
const initializeCryptoKeys = async () => {
  try {
    const cryptoUtil = CryptoUtil.getInstance();
    await cryptoUtil.loadKeys();
    logger.info("Crypto keys loaded successfully");
  } catch (error) {
    errorLogger.error(`Failed to load crypto keys: ${error}`);
    process.exit(1); // Exit if we can't load the keys
  }
};

// Call this before starting your server
export const startServer = async (port: number): Promise<void> => {
  await initializeCryptoKeys();
  app.set("port", port);
  return new Promise((resolve, reject) => {
    try {
      server.listen(port, () => {
        // Initialize Socket.IO
        io = initializeSocket(server);

        const mode = envConstants.NODE_ENV;

        logger.info(`Server is running on port ${port} in ${mode.toUpperCase()} mode ${mode}`);
        logger.info(`Server URL: http://localhost:${port}`);
        resolve();
      });

      server.on("error", (error) => {
        errorLogger.error(`Server error: ${error}`);
        reject(error);
      });
    } catch (error) {
      errorLogger.error(`Failed to start server: ${error}`);
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
