import express, { type Application } from 'express';
import dotenv from 'dotenv';
import { pinoHttp } from 'pino-http';

import { logger } from './utils';
import { auth } from './routes';

dotenv.config();
const port = process.env.APP_PORT ?? 8001;

export const app: Application = express();

app.use(express.json());
app.use(pinoHttp({ logger }));

app.use('/api/v1', auth);

export const server = () => {
  // Start app
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on port ${port}!`);
  });
};
