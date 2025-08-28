import { Router } from "express";

import { authenticate, checkPermission } from "@/middlewares";

import { createRole, getRoles } from "./role.controller.js";

const router = Router();

router.post("/roles", authenticate, checkPermission(["create-roles"]), createRole);
router.get("/roles", authenticate, checkPermission(["view-roles"]), getRoles);

export { router as roleRoutes };
