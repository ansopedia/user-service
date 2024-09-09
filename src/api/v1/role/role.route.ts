import { Router } from 'express';
import { createRole, getRoles } from './role.controller';
import { checkPermission, validateAccessToken } from '@/middlewares';

const router = Router();

router.post('/roles', validateAccessToken, checkPermission(['create-roles']), createRole);
router.get('/roles', validateAccessToken, checkPermission(['view-roles']), getRoles);

export { router as roleRoutes };
