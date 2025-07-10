import { errorLogger } from "../utils";
import { setupInitialRolesAndPermissions, setupInitialUserRole } from "../utils/initialize-db";
import { connectDB, disconnectDB } from "./mongodb";

(async () => {
  try {
    await connectDB();
    await setupInitialRolesAndPermissions();
    await setupInitialUserRole();
  } catch (error) {
    errorLogger.error("Failed to setup initial data:", error);
    process.exit(1);
  } finally {
    await disconnectDB();
  }
})();
