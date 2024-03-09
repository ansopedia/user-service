import { Request, Response } from 'express';
import { UserService } from './user.service';

export const createUser = async (req: Request, res: Response) => {
  try {
    const createdUser = await UserService.createUser(req.body);
    res.send(createdUser);
  } catch (error) {
    res.status(400).send(error);
  }
};
