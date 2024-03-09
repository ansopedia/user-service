import express, { type Application } from 'express';
import { pinoHttp } from 'pino-http';

import { logger } from './utils';
import routes from './routes';
import { envConstants } from './constants';
import { connectDB } from './db/connection';

const { APP_PORT } = envConstants;

const app: Application = express();

(async () => {
  await connectDB();
})();

app.use(pinoHttp({ logger }));

app.use('/v1', routes);

export const server = () => {
  app.listen(APP_PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on port ${APP_PORT}!`);
  });
};
