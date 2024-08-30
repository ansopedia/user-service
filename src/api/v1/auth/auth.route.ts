import { Router } from 'express';
import { AuthController } from './auth.controller';
import { signInWithGoogle, signInWithGoogleCallback, validateAccessToken, validateRefreshToken } from '@/middlewares';

const router = Router();

router.post('/auth/sign-up', AuthController.signUp);
router.post('/auth/login', AuthController.signInWithEmailOrUsernameAndPassword);
router.post('/auth/logout', validateAccessToken, AuthController.signOut);
router.post('/auth/renew-token', validateRefreshToken, AuthController.renewToken);
router.post('/auth/verify-token', validateAccessToken, AuthController.verifyToken);

router.get('/auth/google', signInWithGoogle);
router.get('/auth/google/callback', signInWithGoogleCallback, AuthController.signInWithGoogleCallback);

// router.post('/auth/send-reset-password-email', AuthController.sendResetPasswordEmail);
// router.post('/auth/reset-password', AuthController.resetPassword);
// router.post('/auth/verify-email', AuthController.verifyEmail);

export { router as authRoutes };
