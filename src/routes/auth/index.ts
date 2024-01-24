import express from 'express';
import { AUTH_ROUTES } from '../../constants';
import { validateSignIn, validateSignUp } from '../../utils/validation';
import { handleValidationErrors } from '../../middlewares';
import { AuthController } from '../../controllers/auth-controller';
const authRoutes = express.Router();

authRoutes.post(
  AUTH_ROUTES.SIGN_UP,
  validateSignUp,
  handleValidationErrors,
  AuthController.createUserWithEmailAndPassword,
);

authRoutes.post(AUTH_ROUTES.SIGN_IN, validateSignIn, handleValidationErrors, AuthController.signInWithEmailAndPassword);

export default authRoutes;
