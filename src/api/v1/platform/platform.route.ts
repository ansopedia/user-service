import { Router } from "express";

import { PERMISSIONS } from "@/constants";
import { authenticate, checkPermission } from "@/middlewares";

import { ROUTES } from "../../../constants/routes.constant.js";
import {
  createPlatform,
  deletePlatform,
  getPlatformBySlug,
  getPlatforms,
  updatePlatform,
} from "./platform.controller.js";

const router = Router();

router.post(ROUTES.PLATFORMS.ROOT, authenticate, checkPermission([PERMISSIONS.CREATE_PLATFORM]), createPlatform);
router.get(ROUTES.PLATFORMS.ROOT, authenticate, checkPermission([PERMISSIONS.VIEW_PLATFORMS]), getPlatforms);
router.get(ROUTES.PLATFORMS.BY_SLUG, getPlatformBySlug);
router.put(ROUTES.PLATFORMS.BY_SLUG, authenticate, checkPermission([PERMISSIONS.EDIT_PLATFORM]), updatePlatform);
router.delete(ROUTES.PLATFORMS.BY_SLUG, authenticate, checkPermission([PERMISSIONS.DELETE_PLATFORM]), deletePlatform);

export { router as platformRoutes };
