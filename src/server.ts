import express, { type Application } from 'express';
import { pinoHttp } from 'pino-http';
import helmet from 'helmet';
import cors from 'cors';

import { envConstants, ErrorTypeEnum } from '@/constants';
import { logger } from '@/utils';
import { connectDB } from '@/db/connection';
import { errorHandler } from '@/middlewares';
import { routes } from '@/routes';
import { setupInitialRolesAndPermissions, setupInitialUserRole } from './script/initialize';

const { APP_PORT, INITIAL_SETUP_DONE } = envConstants;

export const app: Application = express();

(async () => {
  await connectDB();
  if (envConstants.NODE_ENV !== 'test' && !INITIAL_SETUP_DONE) {
    await setupInitialRolesAndPermissions();
    await setupInitialUserRole();
  }
})();

if (envConstants.NODE_ENV !== 'test') {
  // Apply Helmet middleware with default options
  app.use(helmet());

  // Apply CORS middleware with a whitelist (adjust origins as needed)
  const allowedOrigins = ['http://localhost:3000'];

  const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
      if (origin === undefined) {
        callback(new Error(ErrorTypeEnum.enum.ORIGIN_IS_UNDEFINED));
      } else if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error(ErrorTypeEnum.enum.NOT_ALLOWED));
      }
    },
    credentials: true,
  };

  app.use(cors(corsOptions));
}

app.use(express.json());
app.use(pinoHttp({ logger }));

app.use('/api/v1', routes);

// Handling non matching request from the client
app.use('*', () => {
  throw new Error(ErrorTypeEnum.enum.RESOURCE_NOT_FOUND);
});

app.use(errorHandler);

export const server = () => {
  app.listen(APP_PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on port ${APP_PORT}!`);
  });
};
