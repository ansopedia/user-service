import { Router } from 'express';
import { AuthController } from './auth.controller';
import { signInWithGoogle, signInWithGoogleCallback, validateAccessToken, validateRefreshToken } from '@/middlewares';

const router = Router();

router.post('/auth/sign-up', AuthController.signUp);
router.post('/auth/login', AuthController.signInWithEmailOrUsernameAndPassword);
router.post('/auth/logout', validateAccessToken, AuthController.logout);
router.post('/auth/renew-token', validateRefreshToken, AuthController.renewToken);
router.post('/auth/verify-token', validateAccessToken, AuthController.verifyToken);
router.post('/auth/forget-password', AuthController.forgetPassword);

router.get('/auth/google', signInWithGoogle);
router.get('/auth/google/callback', signInWithGoogleCallback, AuthController.signInWithGoogleCallback);
router.post('/auth/reset-password', AuthController.resetPassword);

export { router as authRoutes };
