import express, { type Application } from 'express';
import dotenv from 'dotenv';
import { pinoHttp } from 'pino-http';

import { logger } from './utils';
import routes from './routes';

dotenv.config();
const port = process.env.APP_PORT ?? 8000;

const app: Application = express();

app.use(pinoHttp({ logger }));

app.use('/v1', routes);

export const server = () => {
  // Start app
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on port ${port}!`);
  });
};
