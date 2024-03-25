import { Router } from 'express';
import { userRoutes } from '../api/v1/user/user.route';
import { roleRoutes } from '../api/v1/role/role.route';
import { permissionRoutes } from '../api/v1/permission/permission.route';
import { rolePermissionRoutes } from '../api/v1/rolePermission/role-permission.route';
import { userRoleRouter } from '../api/v1/userRole/user-role.route';

export const routes = Router();

routes.use(userRoutes, roleRoutes, permissionRoutes, rolePermissionRoutes, userRoleRouter);
