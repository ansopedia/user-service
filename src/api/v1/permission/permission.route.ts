import { Router } from "express";

import { PERMISSIONS } from "@/constants";
import { authenticate, checkPermission } from "@/middlewares";

import { getPermissions } from "./permission.controller.js";

const router = Router();

router.get("/permissions", authenticate, checkPermission([PERMISSIONS.VIEW_PERMISSIONS]), getPermissions);

export { router as permissionRoutes };
