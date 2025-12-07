import { Router } from "express";

import { authenticate } from "@/middlewares";

import { ROUTES } from "../../../constants/routes.constant.js";
import { ProfileController } from "./profile.controller.js";
import { ProfileService } from "./profile.service.js";

const router = Router();
const profileController = new ProfileController(new ProfileService());

router.put(ROUTES.PROFILES.ROOT, authenticate, profileController.upSertProfile);
router.get(ROUTES.PROFILES.ROOT, authenticate, profileController.getProfile);
router.patch(ROUTES.PROFILES.VISIBILITY, authenticate, profileController.toggleProfileVisibility);

export { router as profileRoutes };
