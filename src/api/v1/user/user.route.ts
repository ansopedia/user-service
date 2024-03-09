import { Router } from 'express';
import { createUser } from './user.controller';

const router = Router();

router.post('/user', createUser);
router.get('/user');
router.put('/user:userId');
router.delete('/user');

export { router as userRoutes };
