import { Router } from "express";

import { authenticate } from "@/middlewares";

import { ProfileController } from "./profile.controller.js";

const router = Router();

router.put("/profile", authenticate, ProfileController.upSertProfile);
router.get("/profile", authenticate, ProfileController.getProfile);
router.patch("/profile/visibility", authenticate, ProfileController.toggleProfileVisibility);

export { router as profileRoutes };
