import { NextFunction, Request, Response } from 'express';
import { OTPService } from './otp.service';
import { sendResponse } from '../../../utils/sendResponse.util';
import { STATUS_CODES } from '../../../constants/statusCode.constant';

export class OTPController {
  public static async sendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { message } = await OTPService.sendOtp(req.body);

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
