import express from 'express';
import { DISABLE_USER_ROUTE, GET_PROFILE_ROUTE } from '../constants';
import { validateEmail } from '../utils/validation/validation';
import { handleValidationErrors, verifyAccessToken } from '../middlewares';
import { UserController } from '../controllers';

const userRoutes = express.Router();

const { getUserById, disableUser } = UserController;

userRoutes.get(GET_PROFILE_ROUTE, verifyAccessToken, getUserById);

userRoutes.post(
  DISABLE_USER_ROUTE,
  validateEmail,
  handleValidationErrors,
  disableUser,
);

export default userRoutes;
