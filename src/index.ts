import { connectDB } from "./config";
import { envConstants } from "./constants";
import { startServer } from "./server";
import { errorLogger } from "./utils";

(async () => {
  try {
    await connectDB();
    await startServer(envConstants.APP_PORT);
  } catch (error) {
    errorLogger.error("Failed to setup initial data:", error);
    process.exit(1);
  }
})();
