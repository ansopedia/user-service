import { Router } from 'express';
import { createRole, getRoles } from './role.controller';
import { validateAccessToken } from '../../../middlewares';

const router = Router();

router.post('/roles', validateAccessToken, createRole);
router.get('/roles', getRoles);

export { router as roleRoutes };
