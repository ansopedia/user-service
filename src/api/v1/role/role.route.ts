import { Router } from "express";

import { ROUTES } from "@/constants";
import { authenticate, checkPermission } from "@/middlewares";

import { RoleController } from "./role.controller.js";

const router = Router();
const roleController = new RoleController();

router.get(ROUTES.ROLES.ROOT, authenticate, checkPermission(["view-roles"]), roleController.getRoles);
router.post(ROUTES.ROLES.ROOT, authenticate, checkPermission(["create-roles"]), roleController.createRole);
router.post(
  ROUTES.ROLES.PERMISSIONS,
  authenticate,
  checkPermission(["create-role-permissions"]),
  roleController.createRolePermission
);

export { router as roleRoutes };
