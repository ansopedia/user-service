import { Router } from "express";

import { ROUTES } from "@/constants";
import { authenticate, checkPermission } from "@/middlewares";

import {
  assignRolesToUser,
  checkUsernameAvailability,
  createUser,
  getAllUsers,
  getUserAccessControl,
  getUserByUsername,
  restoreUser,
  softDeleteUser,
} from "./user.controller.js";

const router = Router();

router.post(ROUTES.USERS.ROOT, authenticate, checkPermission(["create-users"]), createUser);
router.get(ROUTES.USERS.ROOT, authenticate, getAllUsers);
router.get(ROUTES.USERS.CHECK_USERNAME, checkUsernameAvailability);
router.get(ROUTES.USERS.BY_USERNAME, authenticate, getUserByUsername);
router.delete(ROUTES.USERS.BY_ID, authenticate, checkPermission(["delete-users"]), softDeleteUser);
router.patch(ROUTES.USERS.RESTORE, authenticate, checkPermission(["restore-users"]), restoreUser);
router.post(ROUTES.USERS.ASSIGN_ROLES, authenticate, checkPermission(["assign-user-roles"]), assignRolesToUser);
router.get(
  ROUTES.USERS.ACCESS_CONTROL,
  authenticate,
  checkPermission(["view-user-access-control"]),
  getUserAccessControl
);

export { router as userRoutes };
