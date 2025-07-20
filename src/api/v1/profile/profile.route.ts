import { Router } from "express";

import { validateAccessToken } from "@/middlewares";

import { ProfileController } from "./profile.controller";

const router = Router();

router.put("/profile", validateAccessToken, ProfileController.upSertProfile);
router.get("/profile", validateAccessToken, ProfileController.getProfile);
router.patch("/profile/visibility", validateAccessToken, ProfileController.toggleProfileVisibility);

export { router as profileRoutes };
