import { Router } from "express";

import { createUserRole } from "./user-role.controller.js";

const router = Router();

router.post("/user-role", createUserRole);

export { router as userRoleRoutes };
