import { Router } from 'express';
import { userRoutes } from '../api/v1/user/user.route';
import { roleRoutes } from '../api/v1/role/role.route';
import { permissionRoutes } from '../api/v1/permission/permission.route';

export const routes = Router();

routes.use(userRoutes, roleRoutes, permissionRoutes);
