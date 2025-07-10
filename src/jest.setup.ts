import { connectDB, disconnectDB } from "./config";
import { envConstants } from "./constants";
import { startServer, stopServer } from "./server";
import { setupInitialRolesAndPermissions, setupInitialUserRole } from "./utils/initialize-db";

beforeAll(async () => {
  await connectDB();
  await setupInitialRolesAndPermissions();
  await setupInitialUserRole();
  await startServer(envConstants.APP_PORT);
});

afterAll(async () => {
  await disconnectDB();
  await stopServer();
});
