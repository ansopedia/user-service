import { Request, Response } from 'express';

import { sendApiResponse } from '../utils/sendApiResponse';
import {
  ACCOUNT_DISABLED_ERROR,
  INTERNAL_SERVER_ERROR,
  STATUS_CODES,
  USER_NOT_FOUND_ERROR,
} from '../constants';
import {
  USER_DISABLED_SUCCESSFULLY,
  USER_FOUND_SUCCESSFULLY,
  USER_PROFILE_COMPLETED_SUCCESSFULLY,
  USER_STATUS_UPDATED_SUCCESSFULLY,
  USER_VERIFIED_SUCCESSFULLY,
} from '../constants/messages/success';
import { UserProvider } from '../providers/UserProvider';
import { UserDto } from '../dto/UserDto';

export class UserController {
  static async getUserById(req: Request, response: Response) {
    const { userId } = req.body;
    try {
      const user = await UserProvider.getUserById(userId);

      if (!user) {
        sendApiResponse({
          response,
          statusCode: STATUS_CODES.NOT_FOUND,
          message: USER_NOT_FOUND_ERROR,
        });
        return;
      }

      if (user.isAccountDisabled) {
        sendApiResponse({
          response,
          statusCode: STATUS_CODES.FORBIDDEN,
          message: ACCOUNT_DISABLED_ERROR,
        });
        return;
      }

      const userDto = new UserDto(user);
      const userPayload = userDto.getUserDetails();

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

  static async updateUserStatus(request: Request, response: Response) {
    try {
      const { body, params } = request;
      const { isAccountVerified, isAccountDisabled, isProfileComplete } = body;
      const { userId } = params;

      const updatedUser = await UserProvider.updateUserStatusById(
        userId as string,
        {
          isAccountVerified,
          isAccountDisabled,
          isProfileComplete,
        },
      );

      if (!updatedUser) {
        return sendApiResponse({
          response,
          statusCode: STATUS_CODES.NOT_FOUND,
          message: USER_NOT_FOUND_ERROR,
        });
      }

      const userDto = new UserDto(updatedUser);
      const userPayload = userDto.getUserDetails();

      if (updatedUser.isAccountDisabled) {
        return sendApiResponse({
          response,
          statusCode: STATUS_CODES.OK,
          message: USER_DISABLED_SUCCESSFULLY,
          payload: { user: userPayload },
        });
      }

      if (updatedUser.isAccountVerified) {
        return sendApiResponse({
          response,
          statusCode: STATUS_CODES.OK,
          message: USER_VERIFIED_SUCCESSFULLY,
          payload: { user: userPayload },
        });
      }

      if (updatedUser.isProfileComplete) {
        return sendApiResponse({
          response,
          statusCode: STATUS_CODES.OK,
          message: USER_PROFILE_COMPLETED_SUCCESSFULLY,
          payload: { user: userPayload },
        });
      }

      return sendApiResponse({
        response,
        statusCode: STATUS_CODES.OK,
        message: USER_STATUS_UPDATED_SUCCESSFULLY,
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
}
