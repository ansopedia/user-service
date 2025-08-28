import type { Request, Response } from "express";

import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET, STATUS_CODES } from "@/constants";
import { sendResponse, validateObjectId, validateUsername } from "@/utils";

import { success } from "./user.constant.js";
import { UserService } from "./user.service.js";
import { validateRegister } from "./user.validation.js";

export const createUser = async (req: Request, res: Response) => {
  const userData = validateRegister(req.body);

  const user = await UserService.registerUser(userData);
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
  const username = validateUsername(req.params.username);

  const user = await UserService.getUserByUsername(username);
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
  const userId = validateObjectId(req.params.userId);

  const user = await UserService.softDeleteUser(userId);
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
  const userId = validateObjectId(req.params.userId);

  const user = await UserService.restoreUser(userId);
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
  const username = validateUsername(req.params.username);

  const isAvailable = await UserService.checkUsernameAvailability(username);
  sendResponse({
    response: res,
    message: isAvailable ? success.USERNAME_AVAILABLE : success.USERNAME_UNAVAILABLE,
    data: {
      isAvailable,
    },
    statusCode: STATUS_CODES.OK,
  });
};
