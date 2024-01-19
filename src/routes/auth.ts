import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AUTH_ROUTES } from '../constants';
const authRoutes = express.Router();

interface ISignUp {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

authRoutes.post(
  AUTH_ROUTES.SIGN_UP,
  [body('email').isEmail().withMessage('Email must be valid')],
  (req: Request<ISignUp>, res: Response) => {
    const errors = validationResult(req);

    if (errors.isEmpty() === null) {
      res.status(422).send('Hello World!');
    } else res.send('Hello World!');
  },
);

export default authRoutes;
