import { Router } from "express";
import { createRolePermission } from "./role-permission.controller";
import { checkPermission, validateAccessToken } from "@/middlewares";

const router = Router();

router.post(
  "/role-permissions",
  validateAccessToken,
  checkPermission(["create-role-permissions"]),
  createRolePermission
);

export { router as rolePermissionRoutes };
