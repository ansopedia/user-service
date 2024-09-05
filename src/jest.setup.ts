import { connectDB, disconnectDB } from './config';
import { startServer, stopServer } from './server';
import { envConstants } from './constants';
import { setupInitialRolesAndPermissions, setupInitialUserRole } from './script/initialize';

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
