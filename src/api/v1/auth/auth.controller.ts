import { NextFunction, Request, Response } from "express";

import { STATUS_CODES, envConstants } from "@/constants";
import { GoogleUser } from "@/types/passport-google";
import { isValidRedirectUrl, sendResponse } from "@/utils";

import { success } from "./auth.constant";
import { AuthService } from "./auth.service";
import { AuthToken } from "./auth.validation";

export class AuthController {
  private static setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
    res.header("Access-Control-Expose-Headers", "set-cookie, authorization, refresh-token");
    res.setHeader("authorization", accessToken);
    res.setHeader("refresh-token", refreshToken);
    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
  }

  public static async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = await AuthService.signUp(req.body);
      sendResponse({
        response: res,
        message: success.SIGN_UP_SUCCESS,
        statusCode: STATUS_CODES.CREATED,
        data: { token },
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
        data: { userId },
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
      res.cookie("authorization", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60, // 1hr
      });

      // Validate and sanitize the redirect URL
      const state = req.query.state as string;
      let redirectUrl = `${envConstants.CLIENT_URL}/profile?success=true`; // Default redirect URL

      if (state) {
        const decodedUrl = Buffer.from(state, "base64").toString("utf-8");
        if (isValidRedirectUrl(decodedUrl)) {
          redirectUrl = decodedUrl;
        }
      }

      res.redirect(redirectUrl);
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
      const { message, token } = await AuthService.forgetPassword(req.body.email);
      sendResponse({
        response: res,
        message,
        statusCode: STATUS_CODES.OK,
        data: { token },
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
