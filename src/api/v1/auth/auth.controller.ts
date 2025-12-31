import {
  type AuthToken,
  HttpHeaders,
  type LoginResponse,
  type RegisterResponse,
  autoLoginRequestSchema,
  changePasswordRequestSchema,
  loginRequestSchema,
  refreshTokenRequestSchema,
  registerRequestSchema,
  resetPasswordRequestSchema,
  sessionQueryOptionsSchema,
} from "@ansospace/types";
import type { Request, Response } from "express";
import ms from "ms";

import { ErrorTypeEnum, STATUS_CODES, envConstants } from "@/constants";
import { type GoogleUser } from "@/types";
import { extractTokenFromBearerString, getDeviceInfo, isValidRedirectUrl, sendResponse } from "@/utils";

import { success } from "./auth.constant.js";
import { AuthService } from "./auth.service.js";

export class AuthController {
  private static setAuthTokenHeaders(res: Response, accessToken: string, refreshToken: string, deviceId: string) {
    res.header(
      "Access-Control-Expose-Headers",
      `set-cookie, ${HttpHeaders.AUTHORIZATION}, ${HttpHeaders.REFRESH_TOKEN}, ${HttpHeaders.X_DEVICE_ID}`
    );
    res.setHeader(HttpHeaders.AUTHORIZATION, accessToken);
    res.setHeader(HttpHeaders.REFRESH_TOKEN, refreshToken);
    res.setHeader(HttpHeaders.X_DEVICE_ID, deviceId);
  }

  public static async register(req: Request, res: Response) {
    const userData = registerRequestSchema.parse(req.body);

    const registerResponse = await AuthService.register(userData);
    sendResponse<RegisterResponse>({
      response: res,
      message: success.SIGN_UP_SUCCESS,
      statusCode: STATUS_CODES.CREATED,
      data: registerResponse,
    });
  }

  public static async signInWithEmailOrUsernameAndPassword(req: Request, res: Response) {
    const deviceInfo = getDeviceInfo(req);

    // deviceId is undefined if it's the first time the user is logging in
    const deviceId = deviceInfo.deviceId ?? crypto.randomUUID();

    const loginData = loginRequestSchema.parse(req.body);

    const { accessToken, refreshToken, userId }: AuthToken = await AuthService.signInWithEmailOrUsernameAndPassword(
      loginData,
      deviceInfo,
      deviceId
    );

    AuthController.setAuthTokenHeaders(res, accessToken, refreshToken, deviceId);

    sendResponse<LoginResponse>({
      response: res,
      message: success.LOGGED_IN_SUCCESSFULLY,
      statusCode: STATUS_CODES.OK,
      data: { userId },
    });
  }

  public static async signInWithGoogleCallback(req: Request, res: Response) {
    const googleUser = req.user as GoogleUser;

    // Capture device info (bot detection already handled by middleware)
    const deviceInfo = getDeviceInfo(req);

    // deviceId is undefined if it's the first time the user is logging in
    const deviceId = deviceInfo.deviceId ?? crypto.randomUUID();

    const { accessToken, refreshToken, userId } = await AuthService.signInWithGoogle(googleUser, deviceInfo, deviceId);

    AuthController.setAuthTokenHeaders(res, accessToken, refreshToken, deviceId);

    res.cookie("authorization", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge:
        typeof envConstants.ACCESS_TOKEN_EXPIRES_IN === "string" && envConstants.ACCESS_TOKEN_EXPIRES_IN
          ? ms(envConstants.ACCESS_TOKEN_EXPIRES_IN)
          : (envConstants.ACCESS_TOKEN_EXPIRES_IN ?? 0) * 1000,
    });

    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge:
        typeof envConstants.REFRESH_TOKEN_EXPIRES_IN === "string" && envConstants.REFRESH_TOKEN_EXPIRES_IN
          ? ms(envConstants.REFRESH_TOKEN_EXPIRES_IN)
          : (envConstants.REFRESH_TOKEN_EXPIRES_IN ?? 0) * 1000,
    });

    res.cookie("user-id", userId, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge:
        typeof envConstants.ACCESS_TOKEN_EXPIRES_IN === "string" && envConstants.ACCESS_TOKEN_EXPIRES_IN
          ? ms(envConstants.ACCESS_TOKEN_EXPIRES_IN)
          : (envConstants.ACCESS_TOKEN_EXPIRES_IN ?? 0) * 1000,
      domain: process.env.COOKIE_DOMAIN,
      ...(deviceInfo.geolocation?.country !== undefined && {
        // GDPR compliance for EU users
        sameSite: deviceInfo.geolocation?.country === "EU" ? "none" : "strict",
      }),
    });

    res.cookie("x-device-id", deviceId, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge:
        typeof envConstants.ACCESS_TOKEN_EXPIRES_IN === "string" && envConstants.ACCESS_TOKEN_EXPIRES_IN
          ? ms(envConstants.ACCESS_TOKEN_EXPIRES_IN)
          : (envConstants.ACCESS_TOKEN_EXPIRES_IN ?? 0) * 1000,
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

    if (authHeader == null || authHeader === "") throw new Error(ErrorTypeEnum.enum.NO_AUTH_HEADER);

    const accessToken = extractTokenFromBearerString(authHeader);

    await AuthService.logout(accessToken);
    sendResponse({
      response: res,
      message: success.LOGGED_OUT_SUCCESSFULLY,
      statusCode: STATUS_CODES.OK,
    });
  }

  public static async logoutAll(_: Request, res: Response) {
    const { userId } = res.locals.loggedInUser;

    await AuthService.logoutAll(userId);
    sendResponse({
      response: res,
      message: success.LOGGED_OUT_SUCCESSFULLY,
      statusCode: STATUS_CODES.OK,
    });
  }

  public static async logoutOthers(_req: Request, res: Response) {
    const { userId, deviceId } = res.locals.loggedInUser;

    await AuthService.logoutOthers(deviceId, userId);
    sendResponse({
      response: res,
      message: success.LOGGED_OUT_SUCCESSFULLY,
      statusCode: STATUS_CODES.OK,
    });
  }

  public static async getSessions(req: Request, res: Response) {
    const { userId } = res.locals.loggedInUser;
    const sessionQueryOptions = sessionQueryOptionsSchema.parse(req.query);
    const sessions = await AuthService.getSessions(userId, sessionQueryOptions);

    sendResponse({
      response: res,
      message: success.SESSIONS_FETCHED_SUCCESSFULLY,
      statusCode: STATUS_CODES.OK,
      data: sessions,
    });
  }

  public static async refreshToken(req: Request, res: Response) {
    const { refreshToken } = refreshTokenRequestSchema.parse(req.body);

    const { accessToken, refreshToken: newRefreshToken, deviceId } = await AuthService.refreshToken(refreshToken);

    AuthController.setAuthTokenHeaders(res, accessToken, newRefreshToken, deviceId);
    sendResponse({
      response: res,
      message: success.TOKEN_RENEWED_SUCCESSFULLY,
      statusCode: STATUS_CODES.OK,
    });
  }

  public static async resetPassword(req: Request, res: Response) {
    const resetPassword = resetPasswordRequestSchema.parse(req.body);

    await AuthService.resetPassword(resetPassword);

    sendResponse({
      response: res,
      message: success.PASSWORD_RESET_SUCCESSFULLY,
      statusCode: STATUS_CODES.OK,
    });
  }

  public static async changePassword(req: Request, res: Response) {
    const { userId } = res.locals.loggedInUser;
    const password = changePasswordRequestSchema.parse(req.body);

    await AuthService.changePassword(userId, password);

    sendResponse({
      response: res,
      message: success.PASSWORD_CHANGED_SUCCESSFULLY,
      statusCode: STATUS_CODES.OK,
    });
  }

  public static async autoLogin(req: Request, res: Response) {
    const { actionToken } = autoLoginRequestSchema.parse(req.body);

    const deviceInfo = getDeviceInfo(req);

    // deviceId is undefined if it's the first time the user is logging in
    const deviceId = deviceInfo.deviceId ?? crypto.randomUUID();

    const { accessToken, refreshToken, userId }: AuthToken = await AuthService.autoLogin({ actionToken });
    AuthController.setAuthTokenHeaders(res, accessToken, refreshToken, deviceId);

    sendResponse<LoginResponse>({
      response: res,
      message: success.AUTO_LOGIN_SUCCESSFUL,
      statusCode: STATUS_CODES.OK,
      data: { userId },
    });
  }
}
