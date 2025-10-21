import { Router } from "express";

import { authenticate } from "@/middlewares";

import {
  createPlatform,
  deletePlatform,
  getPlatformBySlug,
  getPlatforms,
  updatePlatform,
} from "./platform.controller.js";

const router = Router();

router.post("/platforms", authenticate, createPlatform);
router.get("/platforms", authenticate, getPlatforms);
router.get("/platforms/:slug", authenticate, getPlatformBySlug);
router.put("/platforms/:slug", authenticate, updatePlatform);
router.delete("/platforms/:slug", authenticate, deletePlatform);

export { router as platformRoutes };
