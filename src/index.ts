import { app } from "./app";
import { connectDB } from "./config";
import { envConstants } from "./constants";
import { setupInitialRolesAndPermissions, setupInitialUserRole } from "./script";
import { startServer } from "./server";

(async () => {
  await connectDB();
  if (!envConstants.INITIAL_SETUP_DONE) {
    await setupInitialRolesAndPermissions();
    await setupInitialUserRole();
  }
})();

startServer(envConstants.APP_PORT);

// Export the app for Netlify
export { app };
