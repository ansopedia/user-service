import { Request, Response } from 'express';
import { UserModel } from '../models/User';

import { sendApiResponse } from '../utils/sendApiResponse';
import {
  INTERNAL_SERVER_ERROR,
  STATUS_CODES,
  USER_NOT_FOUND_ERROR,
} from '../constants';
import {
  USER_DISABLED_SUCCESSFULLY,
  USER_FOUND_SUCCESSFULLY,
} from '../constants/messages/success';

export class UserController {
  static async getUserById(req: Request, response: Response) {
    const { userId } = req.body;
    try {
      const user = await UserModel.findById(userId);

      if (!user) {
        sendApiResponse({
          response,
          statusCode: STATUS_CODES.NOT_FOUND,
          message: USER_NOT_FOUND_ERROR,
        });
        return;
      }

      const userPayload = {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isAccountDisabled: user.isAccountDisabled,
        isAccountVerified: user.isAccountVerified,
        isProfileComplete: user.isProfileComplete,
      };

      sendApiResponse({
        response,
        statusCode: STATUS_CODES.OK,
        message: USER_FOUND_SUCCESSFULLY,
        payload: { user: userPayload },
      });
    } catch (error) {
      sendApiResponse({
        response,
        statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: INTERNAL_SERVER_ERROR,
        errors: error as Error,
      });
    }
  }

  static async disableUser(req: Request, res: Response) {
    const { userId } = req.query;
    try {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { isAccountDisabled: true },
        { new: true },
      );

      if (!user) {
        return sendApiResponse({
          response: res,
          statusCode: STATUS_CODES.NOT_FOUND,
          message: USER_NOT_FOUND_ERROR,
        });
      }

      sendApiResponse({
        response: res,
        statusCode: STATUS_CODES.OK,
        message: USER_DISABLED_SUCCESSFULLY,
      });
    } catch (error) {
      sendApiResponse({
        response: res,
        statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: INTERNAL_SERVER_ERROR,
        errors: error as Error,
      });
    }
  }
}
