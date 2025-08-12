import { Router } from "express";

import { authenticate, checkPermission } from "@/middlewares";

import { createRolePermission } from "./role-permission.controller";

const router = Router();

router.post("/role-permissions", authenticate, checkPermission(["create-role-permissions"]), createRolePermission);

export { router as rolePermissionRoutes };
