import express from 'express';
import authRoutes from './auth/auth.routes';
import userRoutes from './user/user.routes';

export const routes = express.Router();

routes.use(authRoutes, userRoutes);
