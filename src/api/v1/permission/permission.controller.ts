import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../../utils/sendResponse.util';
import { success } from './permission.constant';
import { STATUS_CODES } from '../../../constants/statusCode.constant';
import { PermissionService } from './permission.service';

export const createPermission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createdPermission = await PermissionService.createPermission(req.body);
    sendResponse({
      response: res,
      message: success.PERMISSION_CREATED_SUCCESSFULLY,
      payload: {
        permission: createdPermission,
      },
      statusCode: STATUS_CODES.CREATED,
    });
  } catch (error) {
    next(error);
  }
};
