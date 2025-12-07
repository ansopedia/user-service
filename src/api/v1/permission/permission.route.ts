import { Router } from "express";

import { PERMISSIONS } from "@/constants";
import { authenticate, checkPermission } from "@/middlewares";

import { ROUTES } from "../../../constants/routes.constant.js";
import { getPermissions } from "./permission.controller.js";

const router = Router();

router.get(ROUTES.PERMISSIONS.ROOT, authenticate, checkPermission([PERMISSIONS.VIEW_PERMISSIONS]), getPermissions);

export { router as permissionRoutes };
