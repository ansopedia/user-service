import { toggleVisibilitySchema } from "@ansospace/types";
import type { Request, Response } from "express";

import { sendResponse } from "@/utils";

import { UserService } from "../user/user.service.js";
import { success } from "./profile.constant.js";
import { type IProfileService } from "./profile.service.js";

export class ProfileController {
  private profileService: IProfileService;

  constructor(profileService: IProfileService) {
    this.profileService = profileService;
  }

  public upSertProfile = async (req: Request, res: Response) => {
    const profile = await this.profileService.upSertProfileData({
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

  public getProfile = async (_: Request, res: Response) => {
    const profile = await this.profileService.getProfileData(res.locals.loggedInUser.userId);
    const user = await UserService.getUserById(res.locals.loggedInUser.userId);
    sendResponse({
      response: res,
      message: success.PROFILE_FETCHED_SUCCESSFULLY,
      data: { profile, user },
      statusCode: 200,
    });
  };

  public toggleProfileVisibility = async (req: Request, res: Response) => {
    const { isPublic } = toggleVisibilitySchema.parse(req.body);
    const profile = await this.profileService.toggleProfileVisibility(res.locals.loggedInUser.userId, isPublic);
    sendResponse({
      response: res,
      message: success.PROFILE_VISIBILITY_UPDATED_SUCCESSFULLY,
      data: profile,
      statusCode: 200,
    });
  };
}
