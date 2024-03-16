import { Router } from 'express';
import { createUser, getUserByUsername } from './user.controller';

const router = Router();

router.post('/users', createUser);
router.get('/users');
router.get('/users/:username', getUserByUsername);
router.put('/users/:userId');
router.delete('/users/:userId');

export { router as userRoutes };
