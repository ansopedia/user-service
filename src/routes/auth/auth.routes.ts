import express from 'express';
import {
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
  VERIFY_ACCESS_TOKEN,
} from '../../constants';
import {
  validateSignIn,
  validateSignUp,
} from '../../utils/validation/validation';
import { handleValidationErrors, verifyAccessToken } from '../../middlewares';
import { AuthController } from '../../controllers';

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
  VERIFY_ACCESS_TOKEN,
  verifyAccessToken,
  AuthController.verifyAccessToken,
);
export default authRoutes;
