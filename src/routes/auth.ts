import express, { Request, Response } from 'express';
const authRoutes = express.Router();

authRoutes.get('/auth', (_: Request, res: Response) => {
  res.send('Hello World!');
});

export default authRoutes;
