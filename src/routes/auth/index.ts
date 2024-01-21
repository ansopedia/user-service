import express, { Request, Response } from 'express';
import { AUTH_ROUTES, GENERAL_ERRORS } from '../../constants';
import { handleValidationErrors } from '../../middlewares';
import { db } from '../../config/database';
const authRoutes = express.Router();

const { INTERNAL_SERVER_ERROR } = GENERAL_ERRORS;

authRoutes.post(AUTH_ROUTES.SIGN_UP, handleValidationErrors, async (_: Request, res: Response) => {
  try {
    await db?.connect();
    res.status(201).json({ message: '', data: '' });
  } catch (error) {
    res.status(500).json({ message: INTERNAL_SERVER_ERROR, error });
  } finally {
    db?.disconnect();
  }
});

export default authRoutes;
