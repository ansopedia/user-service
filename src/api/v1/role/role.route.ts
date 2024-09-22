import { Router } from "express";

import { checkPermission, validateAccessToken } from "@/middlewares";

import { createRole, getRoles } from "./role.controller";

const router = Router();

router.post("/roles", validateAccessToken, checkPermission(["create-roles"]), createRole);
router.get("/roles", validateAccessToken, checkPermission(["view-roles"]), getRoles);

export { router as roleRoutes };
