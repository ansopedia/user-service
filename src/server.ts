import express, { type Application } from 'express';
import { pinoHttp } from 'pino-http';

import { logger } from './utils';
import routes from './routes';
import { envConstants } from './constants';
import { connectDB } from './db/connection';
import { errorHandler } from './middlewares/errorHandler';
import { ErrorTypeEnum } from './constants/errorTypes.constant';

const { APP_PORT } = envConstants;

export const app: Application = express();

(async () => {
  await connectDB();
})();

app.use(express.json());
app.use(pinoHttp({ logger }));

app.use('/v1', routes);

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
