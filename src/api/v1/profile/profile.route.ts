import { Router } from "express";

import { authenticate } from "@/middlewares";

import { ROUTES } from "../../../constants/routes.constant.js";
import { ProfileController } from "./profile.controller.js";
import { ProfileService } from "./profile.service.js";

const router = Router();
const profileController = new ProfileController(new ProfileService());

router.put(ROUTES.PROFILE.ROOT, authenticate, profileController.upSertProfile);
router.get(ROUTES.PROFILE.ROOT, authenticate, profileController.getProfile);
router.patch(ROUTES.PROFILE.VISIBILITY, authenticate, profileController.toggleProfileVisibility);
router.get(ROUTES.PROFILE.ACCESS_CONTROL, authenticate, profileController.getAccessControlProfile);

export { router as profileRoutes };
