import express, { type Application } from 'express';
import pinoHTTP from 'pino-http';
import dotenv from 'dotenv';

import connectDB from './config/config';
import { logger } from './utils/Logger';

dotenv.config();
const port = process.env.APP_PORT ?? 8000;

// Boot express
export const app: Application = express();

app.use(pinoHTTP({ logger }));

//Database Connection
connectDB();

// Start server
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening on port ${port}!`);
});
