import { NextFunction, Request, Response } from 'express';
import { success } from './auth.constant';
import { sendResponse } from '../../../utils/sendResponse.util';
import { STATUS_CODES } from '../../../constants/statusCode.constant';
import { AuthService } from './auth.service';
import { Auth } from './auth.validation';

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

  public static async signInWithEmailAndPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { accessToken, refreshToken, userId }: Auth = await AuthService.signInWithEmailAndPassword(req.body);

      res.header('Access-Control-Expose-Headers', 'set-cookie, authorization');

      res.setHeader('authorization', accessToken);
      res.cookie('refresh-token', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      sendResponse({
        response: res,
        message: success.LOGGED_IN_SUCCESSFULLY,
        statusCode: STATUS_CODES.OK,
        payload: { userId },
      });
    } catch (error) {
      next(error);
    }
  }
}
