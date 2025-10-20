import { Router } from "express";

import { authenticate } from "@/middlewares";

import {
  createPlatform,
  deletePlatform,
  getPlatformById,
  getPlatforms,
  updatePlatform,
} from "./platform.controller.js";

const router = Router();

router.post("/platforms", authenticate, createPlatform);
router.get("/platforms", authenticate, getPlatforms);
router.get("/platforms/:id", authenticate, getPlatformById);
router.put("/platforms/:id", authenticate, updatePlatform);
router.delete("/platforms/:id", authenticate, deletePlatform);

export { router as platformRoutes };
