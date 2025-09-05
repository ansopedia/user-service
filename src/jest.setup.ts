import { connectDB, disconnectDB } from "./config/index.js";
import { envConstants } from "./constants/env.constant.js";
import { startServer, stopServer } from "./server.js";
import { setupInitialRolesAndPermissions, setupInitialUserRole } from "./utils/index.js";

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
