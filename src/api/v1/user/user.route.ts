import { Router } from "express";

import { checkPermission, validateAccessToken } from "@/middlewares";
import { logger } from "@/utils";

import {
  checkUsernameAvailability,
  createUser,
  getAllUsers,
  getUserByUsername,
  restoreUser,
  softDeleteUser,
} from "./user.controller";

const router = Router();

router.get("/users/health-check", (req, res) => {
  logger.info("User service health check endpoint info", req.path);
  res.status(200).json({ message: "User service is healthy" });
});

router.post("/users", validateAccessToken, checkPermission(["create-users"]), createUser);
router.get("/users", getAllUsers);
router.get("/users/check-username/:username", checkUsernameAvailability);
router.get("/users/:username", getUserByUsername);
router.delete("/users/:userId", validateAccessToken, checkPermission(["delete-users"]), softDeleteUser);
router.patch("/users/:userId/restore", validateAccessToken, checkPermission(["restore-users"]), restoreUser);

export { router as userRoutes };
