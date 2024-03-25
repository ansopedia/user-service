import { NextFunction, Request, Response } from 'express';
import { RoleService } from './role.service';
import { sendResponse } from '../../../utils/sendResponse.util';
import { success } from './role.constant';
import { STATUS_CODES } from '../../../constants/statusCode.constant';

export const createRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createdRole = await RoleService.createRole(req.body);
    sendResponse({
      response: res,
      message: success.ROLE_CREATED_SUCCESSFULLY,
      payload: {
        role: createdRole,
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
