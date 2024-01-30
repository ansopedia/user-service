import express from 'express';
import {
  REFRESH_TOKEN_ROUTE,
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
  VERIFY_ACCESS_TOKEN_ROUTE,
} from '../../constants';
import {
  validateSignIn,
  validateSignUp,
} from '../../utils/validation/validation';
import {
  handleValidationErrors,
  verifyAccessToken,
  verifyRefreshToken,
} from '../../middlewares';
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

authRoutes.post(
  REFRESH_TOKEN_ROUTE,
  verifyRefreshToken,
  AuthController.verifyRefreshToken,
);

authRoutes.get(
  VERIFY_ACCESS_TOKEN_ROUTE,
  verifyAccessToken,
  AuthController.verifyAccessToken,
);
export default authRoutes;
