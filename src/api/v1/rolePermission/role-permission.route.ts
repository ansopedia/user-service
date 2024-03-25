import { Router } from 'express';
import { createRolePermission } from './role-permission.controller';

const router = Router();

router.post('/role-permissions', createRolePermission);

export { router as rolePermissionRoutes };
