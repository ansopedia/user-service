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
    throw new Error(`Failed to load crypto keys: ${error}`);
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

const handleForceClose = (resolve: () => void, reject: (err: Error) => void) => {
  server.close((forceErr) => {
    if (forceErr) reject(forceErr);
    else resolve();
  });
};

const handleServerCloseError = (resolve: () => void, reject: (err: Error) => void) => {
  // Force close all connections if graceful shutdown fails
  server.closeAllConnections();
  setTimeout(() => handleForceClose(resolve, reject), 100); // Small delay to ensure port is freed
};

export const stopServer = (): Promise<void> => {
  logger.info("Server is shutting down...");

  return new Promise((resolve, reject) => {
    if (io) io.close();

    server.close((err) => {
      if (err) handleServerCloseError(resolve, reject);
      else resolve();
    });
  });
};

export default app;
