import { NextFunction, Request, Response } from 'express';
import { OtpService } from './otp.service';
import { sendResponse } from '../../../utils/sendResponse.util';
import { STATUS_CODES } from '../../../constants/statusCode.constant';

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
      const { message } = await OtpService.verifyOtp(req.body);

      sendResponse({
        response: res,
        message: message,
        statusCode: STATUS_CODES.OK,
      });
    } catch (error) {
      next(error);
    }
  }
}
