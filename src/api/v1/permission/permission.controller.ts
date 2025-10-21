import type { Request, Response } from "express";

import { STATUS_CODES } from "@/constants";
import { sendResponse } from "@/utils";

import { success } from "./permission.constant.js";
import { PermissionService } from "./permission.service.js";

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
