import express, { Request, Response } from 'express';
const routes = express.Router();

routes.get('/', (_: Request, res: Response) => {
  res.send('Hello World!');
});

export default routes;
