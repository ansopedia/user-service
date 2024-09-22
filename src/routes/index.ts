import { Router } from "express";
import { userRoutes } from "@/api/v1/user/user.route";
import { roleRoutes } from "@/api/v1/role/role.route";
import { permissionRoutes } from "@/api/v1/permission/permission.route";
import { rolePermissionRoutes } from "@/api/v1/rolePermission/role-permission.route";
import { authRoutes } from "@/api/v1/auth/auth.route";
import { userRoleRoutes } from "@/api/v1/userRole/user-role.route";
import { otpRoutes } from "@/api/v1/otp/otp.route";
import { profileRoutes } from "@/api/v1/profile/profile.route";

export const routes = Router();

routes.use(
  userRoutes,
  roleRoutes,
  permissionRoutes,
  rolePermissionRoutes,
  userRoutes,
  userRoleRoutes,
  authRoutes,
  otpRoutes,
  profileRoutes
);
