import { NextFunction, Request, Response } from 'express';
import { STATUS_CODES } from '../../../constants/statusCode.constant';
import { sendResponse } from '../../../utils/sendResponse.util';
import { success } from './role-permission.constant';
import { RolePermissionService } from './role-permission.service';

export const createRolePermission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rolePermission = await RolePermissionService.createRolePermission(req.body);
    sendResponse({
      response: res,
      message: success.ROLE_PERMISSION_CREATED_SUCCESSFULLY,
      payload: {
        rolePermission,
      },
      statusCode: STATUS_CODES.CREATED,
    });
  } catch (error) {
    next(error);
  }
};
