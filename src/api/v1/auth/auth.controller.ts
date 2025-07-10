import { Request, Response } from "express";

import { STATUS_CODES, envConstants } from "@/constants";
import { GoogleUser } from "@/types/passport-google";
import { isValidRedirectUrl, sendResponse } from "@/utils";

import { success } from "./auth.constant";
import { AuthService } from "./auth.service";
import { AuthToken, SignUpResponse } from "./auth.validation";

export class AuthController {
  private static setAuthTokenHeaders(res: Response, accessToken: string, refreshToken: string) {
    res.header("Access-Control-Expose-Headers", "set-cookie, authorization, refresh-token");
    res.setHeader("authorization", accessToken);
    res.setHeader("refresh-token", refreshToken);
  }

  public static async signUp(req: Request, res: Response) {
    const signUpResponse = await AuthService.signUp(req.body);
    sendResponse<SignUpResponse>({
      response: res,
      message: success.SIGN_UP_SUCCESS,
      statusCode: STATUS_CODES.CREATED,
      data: signUpResponse,
    });
  }

  public static async signInWithEmailOrUsernameAndPassword(req: Request, res: Response) {
    const { accessToken, refreshToken, userId }: AuthToken = await AuthService.signInWithEmailOrUsernameAndPassword(
      req.body
    );
    AuthController.setAuthTokenHeaders(res, accessToken, refreshToken);
    sendResponse({
      response: res,
      message: success.LOGGED_IN_SUCCESSFULLY,
      statusCode: STATUS_CODES.OK,
      data: { userId },
    });
  }

  public static async signInWithGoogleCallback(req: Request, res: Response) {
    const googleUser = req.user as GoogleUser;
    const { accessToken, refreshToken, userId } = await AuthService.signInWithGoogle(googleUser);

    AuthController.setAuthTokenHeaders(res, accessToken, refreshToken);

    res.cookie("authorization", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60, // 1hr
    });

    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60, // 1hr
    });

    res.cookie("user-id", userId, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60, // 1hr
    });

    // Validate and sanitize the redirect URL
    const state = req.query.state as string;
    const allowedRedirects = [`${envConstants.CLIENT_URL}/profile`, `${envConstants.CLIENT_URL}/dashboard`];
    let redirectUrl = `${envConstants.CLIENT_URL}/profile?success=true`; // Default redirect URL

    if (state) {
      const decodedUrl = Buffer.from(state, "base64").toString("utf-8");
      if (isValidRedirectUrl(decodedUrl) && allowedRedirects.some((url) => decodedUrl.startsWith(url))) {
        redirectUrl = decodedUrl;
      }
    }

    res.redirect(redirectUrl);
  }

  public static async logout(_: Request, res: Response) {
    await AuthService.logout(res.locals.loggedInUser.userId);
    sendResponse({
      response: res,
      message: success.LOGGED_OUT_SUCCESSFULLY,
      statusCode: STATUS_CODES.OK,
    });
  }

  public static async verifyToken(_: Request, res: Response) {
    await AuthService.verifyToken(res.locals.loggedInUser.userId);
    sendResponse({
      response: res,
      message: success.TOKEN_VERIFIED,
      statusCode: STATUS_CODES.OK,
    });
  }

  public static async renewToken(_: Request, res: Response) {
    const { accessToken, refreshToken, userId }: AuthToken = await AuthService.generateAccessAndRefreshToken(
      res.locals.loggedInUser.userId
    );
    AuthController.setAuthTokenHeaders(res, accessToken, refreshToken);
    sendResponse({
      response: res,
      message: success.TOKEN_RENEWED_SUCCESSFULLY,
      statusCode: STATUS_CODES.OK,
      data: { userId },
    });
  }

  public static async forgetPassword(req: Request, res: Response) {
    const { message, token } = await AuthService.forgetPassword(req.body.email);
    sendResponse({
      response: res,
      message,
      statusCode: STATUS_CODES.OK,
      data: { token },
    });
  }

  public static async resetPassword(req: Request, res: Response) {
    const { accessToken, refreshToken, userId } = await AuthService.resetPassword(req.body);
    AuthController.setAuthTokenHeaders(res, accessToken, refreshToken);

    sendResponse({
      response: res,
      message: success.PASSWORD_RESET_SUCCESSFULLY,
      statusCode: STATUS_CODES.OK,
      data: { userId },
    });
  }
}
