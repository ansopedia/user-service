import type { Request, Response } from "express";

import { ErrorTypeEnum, STATUS_CODES, envConstants } from "@/constants";
import { type GoogleUser } from "@/types";
import {
  extractTokenFromBearerString,
  getDeviceInfo,
  isValidRedirectUrl,
  sendResponse,
  validateEmail,
  validateObjectId,
} from "@/utils";

import { validateRegister, validateResetPasswordSchema } from "../user/user.validation.js";
import { success } from "./auth.constant.js";
import { AuthService } from "./auth.service.js";
import { type AuthToken, type SignUpResponse, loginSchema, validateRefreshTokenSchema } from "./auth.validation.js";

export class AuthController {
  private static setAuthTokenHeaders(res: Response, accessToken: string, refreshToken: string, deviceId: string) {
    res.header("Access-Control-Expose-Headers", "set-cookie, authorization, refresh-token");
    res.setHeader("authorization", accessToken);
    res.setHeader("refresh-token", refreshToken);
    res.setHeader("x-device-id", deviceId);
  }

  public static async register(req: Request, res: Response) {
    const userData = validateRegister(req.body);

    const signUpResponse = await AuthService.register(userData);
    sendResponse<SignUpResponse>({
      response: res,
      message: success.SIGN_UP_SUCCESS,
      statusCode: STATUS_CODES.CREATED,
      data: signUpResponse,
    });
  }

  public static async signInWithEmailOrUsernameAndPassword(req: Request, res: Response) {
    // Capture device info
    const deviceInfo = getDeviceInfo(req);

    // Security: Block bots immediately
    if (deviceInfo.isBot) {
      throw new Error(ErrorTypeEnum.enum.BOT_ACCESS_FORBIDDEN);
    }

    // deviceId is undefined if it's the first time the user is logging in
    const deviceId = deviceInfo.deviceId ?? crypto.randomUUID();

    const loginData = loginSchema.parse(req.body);

    const { accessToken, refreshToken, userId }: AuthToken = await AuthService.signInWithEmailOrUsernameAndPassword(
      loginData,
      deviceInfo,
      deviceId
    );

    AuthController.setAuthTokenHeaders(res, accessToken, refreshToken, deviceId);

    sendResponse({
      response: res,
      message: success.LOGGED_IN_SUCCESSFULLY,
      statusCode: STATUS_CODES.OK,
      data: { userId, deviceInfo },
    });
  }

  public static async signInWithGoogleCallback(req: Request, res: Response) {
    const googleUser = req.user as GoogleUser;

    // Capture device info
    const deviceInfo = getDeviceInfo(req);

    // Security: Block bots immediately
    if (deviceInfo.isBot) {
      throw new Error(ErrorTypeEnum.enum.BOT_ACCESS_FORBIDDEN);
    }

    // deviceId is undefined if it's the first time the user is logging in
    const deviceId = deviceInfo.deviceId ?? crypto.randomUUID();

    const { accessToken, refreshToken, userId } = await AuthService.signInWithGoogle(googleUser, deviceInfo, deviceId);

    AuthController.setAuthTokenHeaders(res, accessToken, refreshToken, deviceId);

    // TODO: Fix maxAge. sync with env
    res.cookie("authorization", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge:
        typeof envConstants.ACCESS_TOKEN_EXPIRES_IN === "string"
          ? parseInt(envConstants.ACCESS_TOKEN_EXPIRES_IN.replace(/[^0-9]/g, "")) * 1000
          : envConstants.ACCESS_TOKEN_EXPIRES_IN,
    });

    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge:
        typeof envConstants.REFRESH_TOKEN_EXPIRES_IN === "string"
          ? parseInt(envConstants.REFRESH_TOKEN_EXPIRES_IN.replace(/[^0-9]/g, "")) * 1000
          : envConstants.REFRESH_TOKEN_EXPIRES_IN,
    });

    res.cookie("user-id", userId, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge:
        typeof envConstants.ACCESS_TOKEN_EXPIRES_IN === "string"
          ? parseInt(envConstants.ACCESS_TOKEN_EXPIRES_IN.replace(/[^0-9]/g, "")) * 1000
          : envConstants.ACCESS_TOKEN_EXPIRES_IN,
      domain: process.env.COOKIE_DOMAIN,
      ...(deviceInfo.geolocation?.country !== null && {
        // GDPR compliance for EU users
        sameSite: deviceInfo.geolocation?.country === "EU" ? "none" : "strict",
      }),
    });

    res.cookie("x-device-id", deviceId, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge:
        typeof envConstants.ACCESS_TOKEN_EXPIRES_IN === "string"
          ? parseInt(envConstants.ACCESS_TOKEN_EXPIRES_IN.replace(/[^0-9]/g, "")) * 1000
          : envConstants.ACCESS_TOKEN_EXPIRES_IN,
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

  public static async logout(req: Request, res: Response) {
    const authHeader = req.headers.authorization;
    const { sessionId } = req.body;
    validateObjectId(sessionId);

    if (authHeader == null || authHeader === "") throw new Error(ErrorTypeEnum.enum.NO_AUTH_HEADER);

    const accessToken = extractTokenFromBearerString(authHeader);

    await AuthService.logout(accessToken, sessionId);
    sendResponse({
      response: res,
      message: success.LOGGED_OUT_SUCCESSFULLY,
      statusCode: STATUS_CODES.OK,
    });
  }

  public static async logoutAll(_: Request, res: Response) {
    const { userId } = res.locals.loggedInUser;

    // Extract access token from authorization header
    // const authHeader = req.headers.authorization;
    // const accessToken = authHeader != null ? extractTokenFromBearerString(authHeader) : undefined;

    await AuthService.logoutAll(userId);
    sendResponse({
      response: res,
      message: success.LOGGED_OUT_SUCCESSFULLY,
      statusCode: STATUS_CODES.OK,
    });
  }

  public static async logoutOthers(req: Request, res: Response) {
    const { userId } = res.locals.loggedInUser;
    const { sessionId } = req.body;
    validateObjectId(sessionId);

    // Extract access token from authorization header
    // const authHeader = req.headers.authorization;
    // const accessToken = authHeader != null ? extractTokenFromBearerString(authHeader) : undefined;

    await AuthService.logoutOthers(sessionId, userId);
    sendResponse({
      response: res,
      message: success.LOGGED_OUT_SUCCESSFULLY,
      statusCode: STATUS_CODES.OK,
    });
  }

  public static async getSessions(_: Request, res: Response) {
    const { userId } = res.locals.loggedInUser;
    const sessions = await AuthService.getSessions(userId);
    sendResponse({
      response: res,
      message: success.SESSIONS_FETCHED_SUCCESSFULLY,
      statusCode: STATUS_CODES.OK,
      data: sessions,
    });
  }

  public static async refreshToken(req: Request, res: Response) {
    const { refreshToken } = validateRefreshTokenSchema(req.body);

    const {
      accessToken,
      refreshToken: newRefreshToken,
      userId,
      deviceId,
    } = await AuthService.refreshToken(refreshToken);

    AuthController.setAuthTokenHeaders(res, accessToken, newRefreshToken, deviceId);
    sendResponse({
      response: res,
      message: success.TOKEN_RENEWED_SUCCESSFULLY,
      statusCode: STATUS_CODES.OK,
      data: { userId },
    });
  }

  public static async forgetPassword(req: Request, res: Response) {
    const email = validateEmail(req.body.email);

    const { message, token } = await AuthService.forgetPassword(email);
    sendResponse({
      response: res,
      message,
      statusCode: STATUS_CODES.OK,
      data: { token },
    });
  }

  public static async resetPassword(req: Request, res: Response) {
    const resetPasswordSchema = validateResetPasswordSchema(req.body);

    await AuthService.resetPassword(resetPasswordSchema);

    sendResponse({
      response: res,
      message: success.PASSWORD_RESET_SUCCESSFULLY,
      statusCode: STATUS_CODES.OK,
    });
  }
}
