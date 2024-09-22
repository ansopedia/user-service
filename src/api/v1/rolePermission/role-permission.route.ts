import { Router } from "express";

import { checkPermission, validateAccessToken } from "@/middlewares";

import { createRolePermission } from "./role-permission.controller";

const router = Router();

router.post(
  "/role-permissions",
  validateAccessToken,
  checkPermission(["create-role-permissions"]),
  createRolePermission
);

export { router as rolePermissionRoutes };
