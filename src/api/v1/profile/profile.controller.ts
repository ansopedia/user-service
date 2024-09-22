import { NextFunction, Request, Response } from "express";

import { sendResponse } from "@/utils";

import { success } from "./profile.constant";
import { ProfileService } from "./profile.service";

export class ProfileController {
  static upSertProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await new ProfileService().upSertProfileData({
        userId: req.body.loggedInUser.userId,
        ...req.body,
      });
      sendResponse({
        response: res,
        message: success.PROFILE_UPDATED_SUCCESSFULLY,
        payload: profile,
        statusCode: 200,
      });
    } catch (error) {
      next(error);
    }
  };
}
