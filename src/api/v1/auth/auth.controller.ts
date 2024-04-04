import { NextFunction, Request, Response } from 'express';
import { success } from './auth.constant';
import { sendResponse } from '../../../utils/sendResponse.util';
import { STATUS_CODES } from '../../../constants/statusCode.constant';
import { AuthService } from './auth.service';

export class AuthController {
  public static async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthService.signUp(req.body);
      sendResponse({
        response: res,
        message: success.SIGN_UP_SUCCESS,
        statusCode: STATUS_CODES.CREATED,
      });
    } catch (error) {
      next(error);
    }
  }
}
