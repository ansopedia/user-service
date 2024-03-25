import { NextFunction, Request, Response } from 'express';
import { STATUS_CODES } from '../../../constants/statusCode.constant';
import { sendResponse } from '../../../utils/sendResponse.util';
import { success } from './user-role.constant';
import { UserRoleService } from './user-role.service';

export const createUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const createdUserRole = await UserRoleService.createUserRole(req.body);
    sendResponse({
      response: res,
      message: success.USER_ROLE_CREATED_SUCCESSFULLY,
      payload: {
        userRole: createdUserRole,
      },
      statusCode: STATUS_CODES.CREATED,
    });
  } catch (error) {
    next(error);
  }
};
