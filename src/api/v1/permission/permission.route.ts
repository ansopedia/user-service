import { Router } from 'express';
import { createPermission, getPermissions } from './permission.controller';

const router = Router();

router.post('/permissions', createPermission);
router.get('/permissions', getPermissions);

export { router as permissionRoutes };
