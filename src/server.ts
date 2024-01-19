import express, { type Application } from 'express';
import { pinoHttp } from 'pino-http';

import { logger } from './utils';
import routes from './routes';
import { APP_PORT } from './constants';

const app: Application = express();

app.use(pinoHttp({ logger }));

app.use('/v1', routes);

export const server = () => {
  app.listen(APP_PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on port ${APP_PORT}!`);
  });
};
