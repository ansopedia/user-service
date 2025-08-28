import type { Request, Response } from "express";

import { sendResponse } from "@/utils";

import { UserService } from "../user/user.service.js";
import { success } from "./profile.constant.js";
import { ProfileService } from "./profile.service.js";
import { toggleVisibilitySchema } from "./profile.validation.js";

export class ProfileController {
  static upSertProfile = async (req: Request, res: Response) => {
    const profile = await new ProfileService().upSertProfileData({
      userId: res.locals.loggedInUser.userId,
      ...req.body,
    });
    sendResponse({
      response: res,
      message: success.PROFILE_UPDATED_SUCCESSFULLY,
      data: profile,
      statusCode: 200,
    });
  };

  static getProfile = async (_: Request, res: Response) => {
    const profile = await new ProfileService().getProfileData(res.locals.loggedInUser.userId);
    const user = await UserService.getUserById(res.locals.loggedInUser.userId);
    sendResponse({
      response: res,
      message: success.PROFILE_FETCHED_SUCCESSFULLY,
      data: { profile, user },
      statusCode: 200,
    });
  };

  static toggleProfileVisibility = async (req: Request, res: Response) => {
    const { isPublic } = toggleVisibilitySchema.parse(req.body);
    const profile = await new ProfileService().toggleProfileVisibility(res.locals.loggedInUser.userId, isPublic);
    sendResponse({
      response: res,
      message: success.PROFILE_VISIBILITY_UPDATED_SUCCESSFULLY,
      data: profile,
      statusCode: 200,
    });
  };
}
