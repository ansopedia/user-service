import { Router } from "express";

import { authenticate, signInWithGoogle, signInWithGoogleCallback } from "@/middlewares";

import { ROUTES } from "../../../constants/routes.constant.js";
import { AuthController } from "./auth.controller.js";

const router = Router();

router.post(ROUTES.AUTH.REGISTER, AuthController.register); // Register a new user account.
router.post(ROUTES.AUTH.LOGIN, AuthController.signInWithEmailOrUsernameAndPassword); // Log in with credentials (returns Access + Refresh tokens).
router.post(ROUTES.AUTH.AUTO_LOGIN, AuthController.autoLogin); // Auto Login using Action Token (returns new Access + Refresh tokens).
router.post(ROUTES.AUTH.REFRESH, AuthController.refreshToken); // Exchange a valid Refresh Token for a new Access Token.
router.post(ROUTES.AUTH.RESET_PASSWORD, AuthController.resetPassword); // Reset password using a verified token.

router.get(ROUTES.AUTH.GOOGLE, signInWithGoogle); // Initiate Google OAuth flow.
router.get(ROUTES.AUTH.GOOGLE_CALLBACK, signInWithGoogleCallback, AuthController.signInWithGoogleCallback); // Handle Google OAuth callback.

// Sessions related routes
router.get(ROUTES.SESSIONS.ROOT, authenticate, AuthController.getSessions); // List all active sessions (IP, Browser, Device) for the user.
router.delete(ROUTES.SESSIONS.CURRENT, authenticate, AuthController.logout); // Logout. Revoke the current session only.
router.delete(ROUTES.SESSIONS.OTHERS, authenticate, AuthController.logoutOthers); // Logout Others. Revoke all sessions except the current one.
router.delete(ROUTES.SESSIONS.ROOT, authenticate, AuthController.logoutAll); //Logout All. Revoke all active sessions for the user.

export { router as authRouter };
