import express from 'express';
import { UPDATE_USER_STATUS_ROUTE, GET_USER_ROUTE } from '../constants';
import { handleValidationErrors, verifyAccessToken } from '../middlewares';
import { UserController } from '../controllers';
import { validateUserStatusFields } from '../utils/validation/validation';

const userRoutes = express.Router();

const { getUserById, updateUserStatus } = UserController;

userRoutes.get(GET_USER_ROUTE, verifyAccessToken, getUserById);

userRoutes.put(
  UPDATE_USER_STATUS_ROUTE,
  validateUserStatusFields,
  handleValidationErrors,
  verifyAccessToken,
  updateUserStatus,
);

export default userRoutes;
