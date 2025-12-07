import { errorLogger, setupInitialRolesAndPermissions, setupInitialUserRole } from "@/utils";

import { connectDB, disconnectDB } from "./mongodb.js";

(async () => {
  try {
    await connectDB();
    await setupInitialRolesAndPermissions();
    await setupInitialUserRole();
  } catch (error) {
    errorLogger.error(`Failed to setup initial data: ${error}`);
    throw new Error(`Failed to setup initial data: ${error}`);
  } finally {
    await disconnectDB();
  }
})();
