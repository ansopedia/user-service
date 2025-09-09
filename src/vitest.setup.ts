import { connectDB, disconnectDB } from "./config/index.js";
import { startServer, stopServer } from "./server.js";
import { setupInitialRolesAndPermissions, setupInitialUserRole } from "./utils/index.js";
import { getRandomAvailablePort } from "./utils/port.util.js";

let serverPort: number;

beforeAll(async () => {
  await connectDB();
  await setupInitialRolesAndPermissions();
  await setupInitialUserRole();

  // Get a random available port for parallel test runs
  serverPort = await getRandomAvailablePort();

  await startServer(serverPort);
});

afterAll(async () => {
  await disconnectDB();
  await stopServer();
});
