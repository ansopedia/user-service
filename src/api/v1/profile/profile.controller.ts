import { NextFunction, Request, Response } from "express";

import { sendResponse } from "@/utils";

import { UserService } from "../user/user.service";
import { success } from "./profile.constant";
import { ProfileService } from "./profile.service";

export class ProfileController {
  static upSertProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
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
    } catch (error) {
      next(error);
    }
  };

  static getProfile = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await new ProfileService().getProfileData(res.locals.loggedInUser.userId);
      const user = await UserService.getUserById(res.locals.loggedInUser.userId);
      sendResponse({
        response: res,
        message: success.PROFILE_FETCHED_SUCCESSFULLY,
        data: { profile, user },
        statusCode: 200,
      });
    } catch (error) {
      next(error);
    }
  };
}
