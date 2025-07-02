import { connectDB } from "./config";
import { envConstants } from "./constants";
import { startServer } from "./server";
import { logger } from "./utils";
import { setupInitialRolesAndPermissions, setupInitialUserRole } from "./utils/initialize-db";

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
