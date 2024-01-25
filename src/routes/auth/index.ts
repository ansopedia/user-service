import express from 'express';
import { SIGN_IN_ROUTE, SIGN_UP_ROUTE } from '../../constants';
import { validateSignIn, validateSignUp } from '../../utils/validation';
import { handleValidationErrors } from '../../middlewares';
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

export default authRoutes;
