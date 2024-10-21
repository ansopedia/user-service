import { Handler, HandlerContext, HandlerEvent } from "@netlify/functions";
import serverless from "serverless-http";

import { app } from "../../src/app";
import { connectDB } from "../../src/config";
import { envConstants } from "../../src/constants";
import { setupInitialRolesAndPermissions, setupInitialUserRole } from "../../src/script";

let isInitialized = false;

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (!isInitialized) {
    await connectDB();
    if (!envConstants.INITIAL_SETUP_DONE) {
      await setupInitialRolesAndPermissions();
      await setupInitialUserRole();
    }
    isInitialized = true;
  }

  const serverlessHandler = serverless(app);
  const response = (await serverlessHandler(event, context)) as {
    statusCode: number;
    headers: { [key: string]: string | number | boolean };
    body: string;
  };

  return {
    statusCode: response.statusCode,
    headers: response.headers,
    body: response.body,
  };
};

export { handler };
