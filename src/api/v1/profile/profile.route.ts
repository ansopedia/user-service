import { Router } from "express";

import { validateAccessToken } from "@/middlewares";

import { ProfileController } from "./profile.controller";

const router = Router();

router.put("/profile", validateAccessToken, ProfileController.upSertProfile);

export { router as profileRoutes };
