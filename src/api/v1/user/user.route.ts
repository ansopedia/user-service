import { Router } from "express";

import { authenticate, checkPermission } from "@/middlewares";

import {
  checkUsernameAvailability,
  createUser,
  getAllUsers,
  getUserByUsername,
  restoreUser,
  softDeleteUser,
} from "./user.controller.js";

const router = Router();

router.post("/users", authenticate, checkPermission(["create-users"]), createUser);
router.get("/users", authenticate, getAllUsers);
router.get("/users/check-username/:username", checkUsernameAvailability);
router.get("/users/:username", authenticate, getUserByUsername);
router.delete("/users/:userId", authenticate, checkPermission(["delete-users"]), softDeleteUser);
router.patch("/users/:userId/restore", authenticate, checkPermission(["restore-users"]), restoreUser);

export { router as userRoutes };
