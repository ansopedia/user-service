import { Router } from "express";

import { authRouter } from "@/api/v1/auth/auth.route";
import { otpRoutes } from "@/api/v1/otp/otp.route";
import { permissionRoutes } from "@/api/v1/permission/permission.route";
import { profileRoutes } from "@/api/v1/profile/profile.route";
import { roleRoutes } from "@/api/v1/role/role.route";
import { rolePermissionRoutes } from "@/api/v1/rolePermission/role-permission.route";
import { userRoutes } from "@/api/v1/user/user.route";
import { userRoleRoutes } from "@/api/v1/userRole/user-role.route";

export const routes = Router();

routes.use("/auth", authRouter);

routes.use(
  userRoutes,
  roleRoutes,
  permissionRoutes,
  rolePermissionRoutes,
  userRoutes,
  userRoleRoutes,
  otpRoutes,
  profileRoutes
);
