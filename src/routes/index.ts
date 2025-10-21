import { Router } from "express";

import { authRouter } from "@/api/v1/auth/auth.route.js";
import { otpRoutes } from "@/api/v1/otp/otp.route.js";
import { permissionRoutes } from "@/api/v1/permission/permission.route.js";
import { platformRoutes } from "@/api/v1/platform/platform.route.js";
import { profileRoutes } from "@/api/v1/profile/profile.route.js";
import { roleRoutes } from "@/api/v1/role/role.route.js";
import { rolePermissionRoutes } from "@/api/v1/rolePermission/role-permission.route.js";
import { userRoutes } from "@/api/v1/user/user.route.js";
import { userRoleRoutes } from "@/api/v1/userRole/user-role.route.js";

export const routes = Router();

routes.use("/auth", authRouter);

routes.use(
  userRoutes,
  roleRoutes,
  permissionRoutes,
  platformRoutes,
  rolePermissionRoutes,
  userRoleRoutes,
  otpRoutes,
  profileRoutes
);
