import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();

router.post('/auth/sign-up', AuthController.signUp);
router.post('/auth/login', AuthController.signInWithEmailAndPassword);
router.post('/auth/logout', AuthController.signOut);

export { router as authRoutes };
