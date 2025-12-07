import { Router } from "express";

import { authenticate, signInWithGoogle, signInWithGoogleCallback } from "@/middlewares";

import { ROUTES } from "../../../constants/routes.constant.js";
import { AuthController } from "./auth.controller.js";

const router = Router();

router.post(ROUTES.AUTH.REGISTER, AuthController.register);
router.post(ROUTES.AUTH.LOGIN, AuthController.signInWithEmailOrUsernameAndPassword);
router.post(ROUTES.AUTH.AUTO_LOGIN, AuthController.autoLogin);
router.post(ROUTES.AUTH.REFRESH, AuthController.refreshToken);
router.post(ROUTES.AUTH.LOGOUT, authenticate, AuthController.logout);
router.post(ROUTES.AUTH.LOGOUT_ALL, authenticate, AuthController.logoutAll);
router.post(ROUTES.AUTH.LOGOUT_OTHERS, authenticate, AuthController.logoutOthers);
router.post(ROUTES.AUTH.RESET_PASSWORD, AuthController.resetPassword);

router.get(ROUTES.AUTH.SESSIONS, authenticate, AuthController.getSessions);
router.get(ROUTES.AUTH.GOOGLE, signInWithGoogle);
router.get(ROUTES.AUTH.GOOGLE_CALLBACK, signInWithGoogleCallback, AuthController.signInWithGoogleCallback);

export { router as authRouter };
