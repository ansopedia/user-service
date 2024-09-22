import { NextFunction, Request, Response } from "express";

import { STATUS_CODES } from "@/constants";
import { sendResponse } from "@/utils";

import { success } from "./user-role.constant";
import { UserRoleService } from "./user-role.service";

export const createUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userRole = await UserRoleService.createUserRole(req.body);
    sendResponse({
      response: res,
      message: success.USER_ROLE_CREATED_SUCCESSFULLY,
      payload: {
        userRole,
      },
      statusCode: STATUS_CODES.CREATED,
    });
  } catch (error) {
    next(error);
  }
};
