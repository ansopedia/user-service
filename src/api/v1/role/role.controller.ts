import { NextFunction, Request, Response } from "express";

import { STATUS_CODES } from "@/constants";
import { sendResponse } from "@/utils";

import { success } from "./role.constant";
import { RoleService } from "./role.service";

export const createRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = await RoleService.createRole(req.body);
    sendResponse({
      response: res,
      message: success.ROLE_CREATED_SUCCESSFULLY,
      payload: {
        role,
      },
      statusCode: STATUS_CODES.CREATED,
    });
  } catch (error) {
    next(error);
  }
};

export const getRoles = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await RoleService.getRoles();
    sendResponse({
      response: res,
      message: success.ROLES_FETCHED_SUCCESSFULLY,
      payload: {
        roles,
      },
      statusCode: STATUS_CODES.OK,
    });
  } catch (error) {
    next(error);
  }
};
