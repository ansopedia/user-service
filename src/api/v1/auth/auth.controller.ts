import { NextFunction, Request, Response } from "express";

import { STATUS_CODES, envConstants } from "@/constants";
import { GoogleUser } from "@/types/passport-google";
import { sendResponse } from "@/utils";

import { success } from "./auth.constant";
import { AuthService } from "./auth.service";
import { AuthToken } from "./auth.validation";

export class AuthController {
  private static setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
    res.header("Access-Control-Expose-Headers", "set-cookie, authorization");
    res.setHeader("authorization", accessToken);
    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
  }

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

  public static async signInWithEmailOrUsernameAndPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { accessToken, refreshToken, userId }: AuthToken = await AuthService.signInWithEmailOrUsernameAndPassword(
        req.body
      );
      AuthController.setTokenCookies(res, accessToken, refreshToken);
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

  public static async signInWithGoogleCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const googleUser = req.user as GoogleUser;
      const { accessToken, refreshToken } = await AuthService.signInWithGoogle(googleUser);

      AuthController.setTokenCookies(res, accessToken, refreshToken);

      // TODO: used action token instead of access token
      res.cookie("access-token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60000, // 1 minute
      });

      // Instead of sending a JSON response, redirect to the client's URL
      const state = req.query.state as string;
      const redirectUrl = Buffer.from(state, "base64").toString("utf-8");

      res.redirect(redirectUrl ?? `${envConstants.CLIENT_URL}/login?success=true`);
    } catch (error) {
      next(error);
    }
  }

  public static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthService.logout(req.body.loggedInUser.userId);
      sendResponse({
        response: res,
        message: success.LOGGED_OUT_SUCCESSFULLY,
        statusCode: STATUS_CODES.OK,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthService.verifyToken(req.body.loggedInUser.userId);
      sendResponse({
        response: res,
        message: success.TOKEN_VERIFIED,
        statusCode: STATUS_CODES.OK,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async renewToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { accessToken, refreshToken }: AuthToken = await AuthService.generateAccessAndRefreshToken(
        req.body.loggedInUser.userId
      );
      AuthController.setTokenCookies(res, accessToken, refreshToken);
      sendResponse({
        response: res,
        message: success.TOKEN_RENEWED_SUCCESSFULLY,
        statusCode: STATUS_CODES.OK,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async forgetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthService.forgetPassword(req.body.email);
      sendResponse({
        response: res,
        message: success.FORGET_PASSWORD_EMAIL_SENT,
        statusCode: STATUS_CODES.OK,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthService.resetPassword(req.body);
      sendResponse({
        response: res,
        message: success.PASSWORD_RESET_SUCCESSFULLY,
        statusCode: STATUS_CODES.OK,
      });
    } catch (error) {
      next(error);
    }
  }
}
