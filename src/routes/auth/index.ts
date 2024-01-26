import express from 'express';
import {
  DISABLE_USER_ROUTE,
  GET_PROFILE_ROUTE,
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
} from '../../constants';
import {
  validateEmail,
  validateSignIn,
  validateSignUp,
} from '../../utils/validation';
import { handleValidationErrors, verifyAccessToken } from '../../middlewares';
import { AuthController } from '../../controllers/auth-controller';
const authRoutes = express.Router();

authRoutes.post(
  SIGN_UP_ROUTE,
  validateSignUp,
  handleValidationErrors,
  AuthController.createUserWithEmailAndPassword,
);

authRoutes.post(
  SIGN_IN_ROUTE,
  validateSignIn,
  handleValidationErrors,
  AuthController.signInWithEmailAndPassword,
);

authRoutes.get(
  GET_PROFILE_ROUTE,
  verifyAccessToken,
  AuthController.getUserById,
);

authRoutes.post(
  DISABLE_USER_ROUTE,
  validateEmail,
  handleValidationErrors,
  AuthController.signInWithEmailAndPassword,
);

export default authRoutes;
