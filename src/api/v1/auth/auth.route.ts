import { Router } from "express";

import { authenticate, signInWithGoogle, signInWithGoogleCallback } from "@/middlewares";

import { AuthController } from "./auth.controller.js";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.signInWithEmailOrUsernameAndPassword);
router.post("/auto-login", AuthController.autoLogin);
router.post("/refresh", AuthController.refreshToken);
router.post("/logout", authenticate, AuthController.logout);
router.post("/logout-all", authenticate, AuthController.logoutAll);
router.post("/logout-others", authenticate, AuthController.logoutOthers);
router.post("/reset-password", AuthController.resetPassword);

router.get("/sessions", authenticate, AuthController.getSessions);
router.get("/google", signInWithGoogle);
router.get("/google/callback", signInWithGoogleCallback, AuthController.signInWithGoogleCallback);

export { router as authRouter };
