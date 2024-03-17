import { Router } from 'express';
import { createUser, getAllUsers, getUserByUsername } from './user.controller';

const router = Router();

router.post('/users', createUser);
router.get('/users', getAllUsers);
router.get('/users/:username', getUserByUsername);
router.put('/users/:userId');
router.delete('/users/:userId');

export { router as userRoutes };
