import { Request } from 'express';

export const getServerURL = (req: Request) => {
  return `${req.protocol}://${req.get('host')}`;
};
