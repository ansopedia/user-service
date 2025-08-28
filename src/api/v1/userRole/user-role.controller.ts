import type { Request, Response } from "express";

import { STATUS_CODES } from "@/constants";
import { sendResponse } from "@/utils";

import { success } from "./user-role.constant.js";
import { UserRoleService } from "./user-role.service.js";
import { userRoleSchema } from "./user-role.validation.js";

export const createUserRole = async (req: Request, res: Response): Promise<void> => {
  const validUserRole = userRoleSchema.parse(req.body);

  const userRole = await UserRoleService.createUserRole(validUserRole);
  sendResponse({
    response: res,
    message: success.USER_ROLE_CREATED_SUCCESSFULLY,
    data: {
      userRole,
    },
    statusCode: STATUS_CODES.CREATED,
  });
};
