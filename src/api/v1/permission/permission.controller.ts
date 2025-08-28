import type { Request, Response } from "express";

import { STATUS_CODES } from "@/constants";
import { sendResponse } from "@/utils";

import { success } from "./permission.constant.js";
import { PermissionService } from "./permission.service.js";

export const createPermission = async (req: Request, res: Response) => {
  const createdPermission = await PermissionService.createPermission(req.body);
  sendResponse({
    response: res,
    message: success.PERMISSION_CREATED_SUCCESSFULLY,
    data: {
      permission: createdPermission,
    },
    statusCode: STATUS_CODES.CREATED,
  });
};

export const getPermissions = async (_: Request, res: Response) => {
  const permissions = await PermissionService.getPermissions();
  sendResponse({
    response: res,
    message: success.PERMISSION_FETCHED_SUCCESSFULLY,
    data: {
      permissions,
    },
    statusCode: STATUS_CODES.OK,
  });
};
