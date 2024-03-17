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

export const getAllUsers = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserService.getAllUsers();
    sendResponse({
      response: res,
      message: success.USER_FETCHED_SUCCESSFULLY,
      payload: {
        users,
      },
      statusCode: STATUS_CODES.OK,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserByUsername = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.getUserByUsername(req.params.username);
    sendResponse({
      response: res,
      message: success.USER_FETCHED_SUCCESSFULLY,
      payload: {
        user,
      },
      statusCode: STATUS_CODES.OK,
    });
  } catch (error) {
    next(error);
  }
};

export const softDeleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.softDeleteUser(req.params.userId);
    sendResponse({
      response: res,
      message: success.USER_DELETED_SUCCESSFULLY,
      payload: {
        user,
      },
      statusCode: STATUS_CODES.OK,
    });
  } catch (error) {
    next(error);
  }
};

export const restoreUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.restoreUser(req.params.userId);
    sendResponse({
      response: res,
      message: success.USER_RESTORED_SUCCESSFULLY,
      payload: {
        user,
      },
      statusCode: STATUS_CODES.OK,
    });
  } catch (error) {
    next(error);
  }
};
