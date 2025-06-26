import { connectDB } from "./config";
import { envConstants } from "./constants";
import { setupInitialRolesAndPermissions, setupInitialUserRole } from "./script";
import { startServer } from "./server";
import { logger } from "./utils";

(async () => {
  try {
    await connectDB();
    if (!envConstants.INITIAL_SETUP_DONE) {
      await setupInitialRolesAndPermissions();
      await setupInitialUserRole();
    }
    await startServer(envConstants.APP_PORT);
  } catch (error) {
    logger.error("Failed to setup initial data:", error);
    process.exit(1);
  }
})();
