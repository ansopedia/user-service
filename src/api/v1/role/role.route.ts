import { Router } from 'express';
import { createRole, getRoles } from './role.controller';

const router = Router();

router.post('/roles', createRole);
router.get('/roles', getRoles);

export { router as roleRoutes };
