import type { NextFunction, Request, Response } from "express";

import { STATUS_CODES } from "@/constants";
import { sendResponse } from "@/utils";

import { success } from "./role-permission.constant.js";
import { RolePermissionService } from "./role-permission.service.js";

export const createRolePermission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rolePermission = await RolePermissionService.createRolePermission(req.body);
    sendResponse({
      response: res,
      message: success.ROLE_PERMISSION_CREATED_SUCCESSFULLY,
      data: {
        rolePermission,
      },
      statusCode: STATUS_CODES.CREATED,
    });
  } catch (error) {
    next(error);
  }
};
