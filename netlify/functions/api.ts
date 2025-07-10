import { Handler, HandlerContext, HandlerEvent } from "@netlify/functions";
import serverless from "serverless-http";

import { app } from "../../src/app";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  context.callbackWaitsForEmptyEventLoop = false;

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
