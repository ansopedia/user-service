import { connectDB, disconnectDB } from "./config";
import { envConstants } from "./constants";
import { setupInitialRolesAndPermissions, setupInitialUserRole } from "./script";
import { startServer, stopServer } from "./server";

beforeAll(async () => {
  await connectDB();
  await setupInitialRolesAndPermissions();
  await setupInitialUserRole();
  startServer(envConstants.APP_PORT);
});

afterAll(async () => {
  await disconnectDB();
  stopServer();
});
