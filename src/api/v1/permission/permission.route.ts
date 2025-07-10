import { Router } from "express";

import { validateAccessToken } from "@/middlewares";

import { createPermission, getPermissions } from "./permission.controller";

const router = Router();

router.post("/permissions", createPermission);
router.get("/permissions", validateAccessToken, getPermissions);

export { router as permissionRoutes };
