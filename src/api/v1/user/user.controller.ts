import { Request, Response } from "express";

import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET, STATUS_CODES } from "@/constants";
import { sendResponse } from "@/utils";

import { success } from "./user.constant";
import { UserService } from "./user.service";

export const createUser = async (req: Request, res: Response) => {
  const user = await UserService.createUser(req.body);
  sendResponse({
    response: res,
    message: success.USER_CREATED_SUCCESSFULLY,
    data: {
      user,
    },
    statusCode: STATUS_CODES.CREATED,
  });
};

export const getAllUsers = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || DEFAULT_PAGINATION_LIMIT; // Default limit value
  const offset = parseInt(req.query.offset as string) || DEFAULT_PAGINATION_OFFSET; // Default offset value
  const { users, totalUsers } = await UserService.getAllUsers(limit, offset);
  sendResponse({
    response: res,
    message: success.USER_FETCHED_SUCCESSFULLY,
    data: {
      totalUsers,
      users,
    },
    statusCode: STATUS_CODES.OK,
  });
};

export const getUserByUsername = async (req: Request, res: Response) => {
  const user = await UserService.getUserByUsername(req.params.username);
  sendResponse({
    response: res,
    message: success.USER_FETCHED_SUCCESSFULLY,
    data: {
      ...user,
    },
    statusCode: STATUS_CODES.OK,
  });
};

export const softDeleteUser = async (req: Request, res: Response) => {
  const user = await UserService.softDeleteUser(req.params.userId);
  sendResponse({
    response: res,
    message: success.USER_DELETED_SUCCESSFULLY,
    data: {
      user,
    },
    statusCode: STATUS_CODES.OK,
  });
};

export const restoreUser = async (req: Request, res: Response) => {
  const user = await UserService.restoreUser(req.params.userId);
  sendResponse({
    response: res,
    message: success.USER_RESTORED_SUCCESSFULLY,
    data: {
      user,
    },
    statusCode: STATUS_CODES.OK,
  });
};

export const checkUsernameAvailability = async (req: Request, res: Response) => {
  const isAvailable = await UserService.checkUsernameAvailability(req.params.username);
  sendResponse({
    response: res,
    message: isAvailable ? success.USERNAME_AVAILABLE : success.USERNAME_UNAVAILABLE,
    data: {
      isAvailable,
    },
    statusCode: STATUS_CODES.OK,
  });
};
