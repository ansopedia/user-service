import express, { type Application } from 'express';
import { pinoHttp } from 'pino-http';
import cors from 'cors';

import { logger } from './utils';
import { APP_PORT } from './constants';
import { routes } from './routes';
import getDatabaseConnection from './config/database-config';

export const app: Application = express();

app.use(express.json());
app.use(pinoHttp({ logger }));

app.use(cors({ origin: 'http://localhost:3000' }));

app.use(routes);

(async () => {
  await getDatabaseConnection();
})();

export const server = () => {
  app.listen(APP_PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on port ${APP_PORT}!`);
  });
};
