import { Request, Response } from "express";

import { STATUS_CODES } from "@/constants";
import { sendResponse } from "@/utils";

import { OtpService } from "./otp.service";

export class OtpController {
  public static async sendOtp(req: Request, res: Response) {
    const { message, token } = await OtpService.sendOtp(req.body);

    sendResponse({
      response: res,
      message: message,
      statusCode: STATUS_CODES.OK,
      data: { token },
    });
  }

  public static async verifyOtp(req: Request, res: Response) {
    // Pass the token from the request body to the service
    const { message, actionToken } = await OtpService.verifyOtp(req.body);

    // The token returned here is the action token for forget password,
    sendResponse({
      response: res,
      message: message,
      statusCode: STATUS_CODES.OK,
      data: { actionToken },
    });
  }
}
