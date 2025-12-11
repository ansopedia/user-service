import {
  type UserAccessControlProfile,
  assignUserRoleBodySchema,
  objectId,
  registerRequestSchema,
  usernameSchema,
} from "@ansospace/types";
import type { Request, Response } from "express";

import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET, STATUS_CODES } from "@/constants";
import { sendResponse } from "@/utils";

import { success } from "./user.constant.js";
import { UserService } from "./user.service.js";

export const createUser = async (req: Request, res: Response) => {
  const userData = registerRequestSchema.parse(req.body);

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
  const username = usernameSchema.parse(req.params.username);

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
  const userId = objectId.parse(req.params.userId);

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
  const userId = objectId.parse(req.params.userId);

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
  const username = usernameSchema.parse(req.params.username);

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

export const assignRolesToUser = async (req: Request, res: Response) => {
  const userId = objectId.parse(req.params.userId);
  const { roleIds } = assignUserRoleBodySchema.parse(req.body);

  const assignedRolesToUser = await UserService.assignRolesToUser({ userId, roleIds });

  sendResponse({
    response: res,
    message: assignedRolesToUser.length > 0 ? success.ROLE_ADDED_SUCCESSFULLY : success.ROLE_ALREADY_EXIST,
    data: {
      assignedRolesToUser,
    },
    statusCode: STATUS_CODES.CREATED,
  });
};

export const getAccessControlProfile = async (req: Request, res: Response) => {
  const userId = objectId.parse(req.params.userId);

  const accessControl = await UserService.getAccessControlProfile(userId);

  sendResponse<UserAccessControlProfile>({
    response: res,
    message: success.USER_ACCESS_PROFILE_FETCHED_SUCCESSFULLY,
    data: accessControl,
    statusCode: STATUS_CODES.OK,
  });
};
