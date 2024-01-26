import express from 'express';
import { SIGN_IN_ROUTE, SIGN_UP_ROUTE } from '../../constants';
import {
  validateSignIn,
  validateSignUp,
} from '../../utils/validation/validation';
import { handleValidationErrors } from '../../middlewares';
import { AuthController } from '../../controllers';

const authRoutes = express.Router();

const { createUserWithEmailAndPassword, signInWithEmailAndPassword } =
  AuthController;

authRoutes.post(
  SIGN_UP_ROUTE,
  validateSignUp,
  handleValidationErrors,
  createUserWithEmailAndPassword,
);

authRoutes.post(
  SIGN_IN_ROUTE,
  validateSignIn,
  handleValidationErrors,
  signInWithEmailAndPassword,
);

export default authRoutes;
