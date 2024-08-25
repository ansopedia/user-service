import { Request } from 'express';

export const getServerURL = (req: Request) => {
  return `${req.protocol}://${req.get('host')}`;
};

export const generateRandomUsername = (): string => {
  const randomString = Math.random().toString(36).substring(2, 10);
  return `user_${randomString}`;
};
