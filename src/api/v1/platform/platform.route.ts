import { Router } from "express";

import { PERMISSIONS } from "@/constants";
import { authenticate, checkPermission } from "@/middlewares";

import {
  createPlatform,
  deletePlatform,
  getPlatformBySlug,
  getPlatforms,
  updatePlatform,
} from "./platform.controller.js";

const router = Router();

router.post("/platforms", authenticate, checkPermission([PERMISSIONS.CREATE_PLATFORM]), createPlatform);
router.get("/platforms", authenticate, checkPermission([PERMISSIONS.VIEW_PLATFORMS]), getPlatforms);
router.get("/platforms/:slug", getPlatformBySlug);
router.put("/platforms/:slug", authenticate, checkPermission([PERMISSIONS.EDIT_PLATFORM]), updatePlatform);
router.delete("/platforms/:slug", authenticate, checkPermission([PERMISSIONS.DELETE_PLATFORM]), deletePlatform);

export { router as platformRoutes };
