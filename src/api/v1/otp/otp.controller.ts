import { NextFunction, Request, Response } from "express";
import { OtpService } from "./otp.service";
import { sendResponse } from "@/utils";
import { STATUS_CODES } from "@/constants";

export class OtpController {
  public static async sendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { message } = await OtpService.sendOtp(req.body);

      sendResponse({
        response: res,
        message: message,
        statusCode: STATUS_CODES.OK,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, token } = await OtpService.verifyOtp(req.body);

      if (token != null) {
        res.cookie("action-token", token, {
          httpOnly: false,
          secure: true,
          sameSite: "strict",
          maxAge: 60000, // 1 minute
        });
      }

      sendResponse({
        response: res,
        message: message,
        statusCode: STATUS_CODES.OK,
        payload: { token },
      });
    } catch (error) {
      next(error);
    }
  }
}
