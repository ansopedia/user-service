import { Router } from "express";

import { signInWithGoogle, signInWithGoogleCallback, validateAccessToken, validateRefreshToken } from "@/middlewares";

import { AuthController } from "./auth.controller";

const router = Router();

router.post("/auth/sign-up", AuthController.signUp);
router.post("/auth/login", AuthController.signInWithEmailOrUsernameAndPassword);
router.post("/auth/logout", validateAccessToken, AuthController.logout);
router.post("/auth/renew-token", validateRefreshToken, AuthController.renewToken);
router.post("/auth/verify-token", validateAccessToken, AuthController.verifyToken);
router.post("/auth/forget-password", AuthController.forgetPassword);
router.post("/auth/reset-password", AuthController.resetPassword);

router.get("/auth/google", signInWithGoogle);
router.get("/auth/google/callback", signInWithGoogleCallback, AuthController.signInWithGoogleCallback);

export { router as authRoutes };
