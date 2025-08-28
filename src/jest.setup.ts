import { connectDB, disconnectDB } from "@/config";
import { envConstants } from "@/constants";
import { startServer, stopServer } from "@/server.js";
import { setupInitialRolesAndPermissions, setupInitialUserRole } from "@/utils";

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
