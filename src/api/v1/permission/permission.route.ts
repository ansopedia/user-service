import { Router } from "express";

import { authenticate } from "@/middlewares";

import { createPermission, getPermissions } from "./permission.controller";

const router = Router();

router.post("/permissions", createPermission);
router.get("/permissions", authenticate, getPermissions);

export { router as permissionRoutes };
