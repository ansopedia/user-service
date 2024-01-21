import express, { Request, Response } from 'express';
import { AUTH_ROUTES, GENERAL_ERRORS, USER_REGISTRATION_ERRORS } from '../../constants';
import { validateSignUp } from '../../utils/validation';
import { handleValidationErrors } from '../../middlewares';
import { UserModel } from '../../models/User';
import { db } from '../../config/database';
import { USER_CREATED_SUCCESSFULLY } from '../../constants/messages/success';
const authRoutes = express.Router();

const { INTERNAL_SERVER_ERROR } = GENERAL_ERRORS;
const { EMAIL_ALREADY_EXISTS_ERROR } = USER_REGISTRATION_ERRORS;

authRoutes.post(AUTH_ROUTES.SIGN_UP, validateSignUp, handleValidationErrors, async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    await db?.connect();
    const isUserExist = await UserModel.findOne({ email });
    if (isUserExist) {
      res.status(409).json({ message: EMAIL_ALREADY_EXISTS_ERROR });
      return;
    }

    const newUser = new UserModel({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: USER_CREATED_SUCCESSFULLY, data: newUser });
  } catch (error) {
    res.status(500).json({ message: INTERNAL_SERVER_ERROR, error });
  } finally {
    db?.disconnect();
  }
});

export default authRoutes;