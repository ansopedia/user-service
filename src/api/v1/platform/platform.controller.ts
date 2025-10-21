import type { Request, Response } from "express";

import { STATUS_CODES } from "@/constants";
import { CreatePlatformInputSchema, UpdatePlatformInputSchema } from "@/types";
import { sendResponse } from "@/utils";

import { success } from "./platform.constant.js";
import { PlatformService } from "./platform.service.js";

export const createPlatform = async (req: Request, res: Response) => {
  const parsedInput = CreatePlatformInputSchema.parse(req.body);

  const createdPlatform = await PlatformService.createPlatform({
    ...parsedInput,
    createdBy: res.locals.loggedInUser.userId,
  });

  sendResponse({
    response: res,
    message: success.PLATFORM_CREATED_SUCCESSFULLY,
    data: {
      platform: createdPlatform,
    },
    statusCode: STATUS_CODES.CREATED,
  });
};

export const getPlatforms = async (_: Request, res: Response) => {
  const platforms = await PlatformService.getPlatforms();
  sendResponse({
    response: res,
    message: success.PLATFORM_FETCHED_SUCCESSFULLY,
    data: {
      platforms,
    },
    statusCode: STATUS_CODES.OK,
  });
};

export const getPlatformBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const platform = await PlatformService.getPlatformBySlug(slug);

  sendResponse({
    response: res,
    message: success.PLATFORM_FETCHED_SUCCESSFULLY,
    data: {
      platform,
    },
    statusCode: STATUS_CODES.OK,
  });
};

export const updatePlatform = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const parsedInput = UpdatePlatformInputSchema.parse(req.body);

  const updatedPlatform = await PlatformService.updatePlatformBySlug(slug, {
    ...parsedInput,
    updatedBy: res.locals.loggedInUser.userId,
  });

  sendResponse({
    response: res,
    message: success.PLATFORM_UPDATED_SUCCESSFULLY,
    data: {
      platform: updatedPlatform,
    },
    statusCode: STATUS_CODES.OK,
  });
};

export const deletePlatform = async (req: Request, res: Response) => {
  const { slug } = req.params;

  await PlatformService.deletePlatformBySlug(slug, res.locals.loggedInUser.userId);

  sendResponse({
    response: res,
    message: success.PLATFORM_DELETED_SUCCESSFULLY,
    data: null,
    statusCode: STATUS_CODES.OK,
  });
};
