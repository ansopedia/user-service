import { connectDB } from "./config";
import { envConstants } from "./constants";
import { startServer } from "./server";
import { logger } from "./utils";

(async () => {
  try {
    await connectDB();
    await startServer(envConstants.APP_PORT);
  } catch (error) {
    logger.error("Failed to setup initial data:", error);
    process.exit(1);
  }
})();
