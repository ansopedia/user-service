import { Router } from 'express';
import { createPermission } from './permission.controller';

const router = Router();

router.post('/permissions', createPermission);

export { router as permissionRoutes };
