import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateAccessToken, validateRefreshToken } from '../../../middlewares/auth';

const router = Router();

router.post('/auth/sign-up', AuthController.signUp);
router.post('/auth/login', AuthController.signInWithEmailAndPassword);
router.post('/auth/logout', validateAccessToken, AuthController.signOut);
router.post('/auth/renew-token', validateRefreshToken, AuthController.renewToken);

export { router as authRoutes };
