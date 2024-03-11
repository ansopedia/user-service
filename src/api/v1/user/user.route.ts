import { Router } from 'express';
import { createUser } from './user.controller';

const router = Router();

router.post('/users', createUser);
router.get('/users');
router.put('/users:userId');
router.delete('/users');

export { router as userRoutes };
