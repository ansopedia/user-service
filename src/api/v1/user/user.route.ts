import { Router } from "express";

import { checkPermission, validateAccessToken } from "@/middlewares";

import { createUser, getAllUsers, getUserByUsername, restoreUser, softDeleteUser } from "./user.controller";

const router = Router();

router.post("/users", validateAccessToken, checkPermission(["create-users"]), createUser);
router.get("/users", getAllUsers);
router.get("/users/:username", getUserByUsername);
router.delete("/users/:userId", validateAccessToken, checkPermission(["delete-users"]), softDeleteUser);
router.patch("/users/:userId/restore", validateAccessToken, checkPermission(["restore-users"]), restoreUser);

export { router as userRoutes };
