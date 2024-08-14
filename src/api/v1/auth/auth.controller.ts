import { NextFunction, Request, Response } from 'express';
import { success } from './auth.constant';
import { sendResponse } from '@/utils';
import { STATUS_CODES } from '@/constants';
import { AuthService } from './auth.service';
import { AuthToken } from './auth.validation';

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
      const { accessToken, refreshToken, userId }: AuthToken = await AuthService.signInWithEmailAndPassword(req.body);

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

  public static async signOut(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthService.signOut(req.body.userId);
      sendResponse({
        response: res,
        message: success.LOGGED_OUT_SUCCESSFULLY,
        statusCode: STATUS_CODES.OK,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async renewToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { accessToken, refreshToken }: AuthToken = await AuthService.renewToken(req.body.authUser);

      res.header('Access-Control-Expose-Headers', 'set-cookie, authorization');

      res.setHeader('authorization', accessToken);
      res.cookie('refresh-token', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      sendResponse({
        response: res,
        message: success.REFRESH_TOKEN_SUCCESS,
        statusCode: STATUS_CODES.OK,
      });
    } catch (error) {
      next(error);
    }
  }
}
