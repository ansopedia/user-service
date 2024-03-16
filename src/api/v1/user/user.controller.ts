import { NextFunction, Request, Response } from 'express';
import { UserService } from './user.service';
import { sendResponse } from '../../../utils/sendResponse.util';
import { success } from './user.constant';
import { STATUS_CODES } from '../../../constants/statusCode.constant';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createdUser = await UserService.createUser(req.body);
    sendResponse({
      response: res,
      message: success.USER_CREATED_SUCCESSFULLY,
      payload: {
        user: createdUser,
      },
      statusCode: STATUS_CODES.CREATED,
    });
  } catch (error) {
    next(error);
  }
};
