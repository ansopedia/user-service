import {
  type SendOtpResponse,
  type VerifyOtpResponse,
  sendOtpRequestSchema,
  verifyOtpRequestSchema,
} from "@ansospace/types";
import type { Request, Response } from "express";

import { STATUS_CODES } from "@/constants";
import { sendResponse } from "@/utils";

import { OtpService } from "./otp.service.js";

export class OtpController {
  public static async sendOtp(req: Request, res: Response) {
    const parsedBody = sendOtpRequestSchema.parse(req.body);
    const { message, actionToken } = await OtpService.sendOtp(parsedBody);

    sendResponse<SendOtpResponse>({
      response: res,
      message: message,
      statusCode: STATUS_CODES.OK,
      data: { actionToken },
    });
  }

  public static async verifyOtp(req: Request, res: Response) {
    const parsedBody = verifyOtpRequestSchema.parse(req.body);
    const { message, actionToken } = await OtpService.verifyOtp(parsedBody);

    // The token returned here is the action token for forget password,
    sendResponse<VerifyOtpResponse>({
      response: res,
      message: message,
      statusCode: STATUS_CODES.OK,
      data: { actionToken },
    });
  }
}
