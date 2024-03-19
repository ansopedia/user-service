import { Router } from 'express';
import { createRole } from './role.controller';

const router = Router();

router.post('/roles', createRole);

export { router as roleRoutes };
