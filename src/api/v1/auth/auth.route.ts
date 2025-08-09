import { Router } from "express";

import { signInWithGoogle, signInWithGoogleCallback, validateAccessToken } from "@/middlewares";

import { AuthController } from "./auth.controller";

const router = Router();

router.post("/auth/sign-up", AuthController.signUp);
router.post("/auth/login", AuthController.signInWithEmailOrUsernameAndPassword);
router.post("/auth/logout", AuthController.logout);
router.post("/auth/logout-all", validateAccessToken, AuthController.logoutAll);
router.post("/auth/logout-others", validateAccessToken, AuthController.logoutOthers);
router.get("/auth/sessions", validateAccessToken, AuthController.getSessions);
router.post("/auth/refresh-token", AuthController.renewToken);
router.post("/auth/forget-password", AuthController.forgetPassword);
router.post("/auth/reset-password", AuthController.resetPassword);

router.get("/auth/google", signInWithGoogle);
router.get("/auth/google/callback", signInWithGoogleCallback, AuthController.signInWithGoogleCallback);

export { router as authRoutes };
