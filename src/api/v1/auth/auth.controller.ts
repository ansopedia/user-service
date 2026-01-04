import {
  type AuthToken,
  HttpHeaders,
  type LoginResponse,
  type ObjectId,
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
  /**
   * ✅ NEW HELPER: Centralized Cookie Logic
   * Handles GDPR/Geolocation logic and standardized attributes.
   */
  private static setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
    userId: ObjectId,
    deviceId: string,
    geolocation?: { country?: string }
  ) {
    const isProd = process.env.NODE_ENV === "production";

    // 1. Determine Domain
    // On Localhost: leave undefined (browsers handle ports automatically)
    // On Prod: set to ".ansospace.com" (note the leading dot for broad support)
    const domain = isProd ? ".ansospace.com" : "localhost";

    type SameSite = "strict" | "none" | "lax";
    // 2. Determine SameSite Strategy
    // Default to 'lax' for better UX during OAuth redirects (Google -> Your App).
    // If 'strict', the cookie is blocked on the redirect, effectively logging the user out immediately.
    let sameSite: SameSite = "lax";

    // Restore your GDPR logic:
    if (geolocation?.country === "EU") {
      sameSite = "none";
    }

    const commonOptions = {
      httpOnly: true, // Prevents client-side JS from reading the cookie (XSS protection)
      secure: isProd, // Requires HTTPS (use false for local development)
      domain: domain, // ✅ CRITICAL
      sameSite: sameSite, // 'lax' or 'strict' recommended to prevent CSRF
      path: "/", // ✅ CRITICAL: Ensure it's available on all routes
    };

    // 1. Access Token
    res.cookie(HttpHeaders.AUTHORIZATION, accessToken, {
      ...commonOptions,
      maxAge:
        typeof envConstants.ACCESS_TOKEN_EXPIRES_IN === "string"
          ? ms(envConstants.ACCESS_TOKEN_EXPIRES_IN)
          : (envConstants.ACCESS_TOKEN_EXPIRES_IN ?? 0) * 1000,
    });

    // 2. Refresh Token
    res.cookie(HttpHeaders.REFRESH_TOKEN, refreshToken, {
      ...commonOptions,
      maxAge:
        typeof envConstants.REFRESH_TOKEN_EXPIRES_IN === "string"
          ? ms(envConstants.REFRESH_TOKEN_EXPIRES_IN)
          : (envConstants.REFRESH_TOKEN_EXPIRES_IN ?? 0) * 1000,
    });

    // 3. Metadata (User ID & Device ID)
    res.cookie("user-id", userId, { ...commonOptions });
    res.cookie(HttpHeaders.X_DEVICE_ID, deviceId, { ...commonOptions });
  }

  private static clearAuthCookies(res: Response) {
    const isProd = process.env.NODE_ENV === "production";

    // 1. Determine Domain
    // On Localhost: leave undefined (browsers handle ports automatically)
    // On Prod: set to ".ansospace.com" (note the leading dot for broad support)
    const domain = isProd ? ".ansospace.com" : undefined;

    // GDPR Compliance: strict for most, none for EU (if cross-site needed) or lax
    const sameSite = "lax";
    const commonOptions = {
      httpOnly: true,
      secure: isProd, // Must be true in Prod
      domain: domain, // ✅ CRITICAL
      sameSite: sameSite as "strict" | "none" | "lax",
      path: "/", // ✅ CRITICAL: Ensure it's available on all routes
    };

    res.clearCookie(HttpHeaders.AUTHORIZATION, commonOptions);
    res.clearCookie(HttpHeaders.REFRESH_TOKEN, commonOptions);
  }

  private static setAuthTokenHeaders(res: Response, accessToken: string, refreshToken: string, deviceId: string) {
    res.header(
      "Access-Control-Expose-Headers",
      `set-cookie, ${HttpHeaders.AUTHORIZATION}, ${HttpHeaders.REFRESH_TOKEN}, ${HttpHeaders.X_DEVICE_ID}`
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
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

    // 1. Set Headers (For Mobile/CLI)
    AuthController.setAuthTokenHeaders(res, accessToken, refreshToken, deviceId);

    // 2. ✅ Set Cookies (For Web) - Now supported!
    AuthController.setAuthCookies(res, accessToken, refreshToken, userId, deviceId, deviceInfo.geolocation);

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

    // 1. Set Headers (For Mobile/CLI)
    AuthController.setAuthTokenHeaders(res, accessToken, refreshToken, deviceId);

    // 2. ✅ Set Cookies (For Web) - Now supported!
    AuthController.setAuthCookies(res, accessToken, refreshToken, userId, deviceId, deviceInfo.geolocation);

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
    let accessToken: string | null = null;
    const authHeader = req.headers.authorization;

    if (authHeader !== undefined && authHeader.startsWith("Bearer ")) {
      accessToken = extractTokenFromBearerString(authHeader);
    } else if (req.cookies?.authorization !== undefined) {
      accessToken = req.cookies.authorization;
    }
    if (accessToken == null) throw new Error(ErrorTypeEnum.enum.NO_AUTH_HEADER);

    await AuthService.logout(accessToken);

    // ✅ Clear Cookies on success
    AuthController.clearAuthCookies(res);
    sendResponse({
      response: res,
      message: success.LOGGED_OUT_SUCCESSFULLY,
      statusCode: STATUS_CODES.OK,
    });
  }

  public static async logoutAll(_: Request, res: Response) {
    const { userId } = res.locals.loggedInUser;

    await AuthService.logoutAll(userId);

    // ✅ Clear cookies
    AuthController.clearAuthCookies(res);
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

    const {
      accessToken,
      refreshToken: newRefreshToken,
      deviceId,
      userId,
      deviceInfo,
    } = await AuthService.refreshToken(refreshToken);

    // 1. Set Headers (For Mobile/CLI)
    AuthController.setAuthTokenHeaders(res, accessToken, newRefreshToken, deviceId);

    // 2. ✅ Set Cookies (For Web) - Now supported!
    AuthController.setAuthCookies(res, accessToken, newRefreshToken, userId, deviceId, deviceInfo.geolocation);
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
