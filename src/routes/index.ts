import { Router } from 'express';
import { userRoutes } from '../api/v1/user/user.route';

export const routes = Router();

routes.use(userRoutes);
