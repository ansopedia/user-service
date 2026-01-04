import {
  type AccessTokenPayload,
  type AuthToken,
  type AuthenticatedUser,
  type AutoLoginRequest,
  type ChangePasswordRequest,
  type DeviceId,
  type DeviceInfo,
  type Email,
  type LoginRequest,
  type ObjectId,
  type RefreshTokenPayload,
  type RegisterRequest,
  type RegisterResponse,
  type ResetPasswordRequest,
  type Session,
  type SessionQueryOptions,
  TokenType,
  emailNotificationEvents,
  otpEvents,
  userActions,
  usernameSchema,
} from "@ansospace/types";

import { OtpService } from "@/api/v1/otp/otp.service.js";
import { TokenService } from "@/api/v1/token/index.js";
import { UserDAL } from "@/api/v1/user/user.dal.js";
import { UserService } from "@/api/v1/user/user.service.js";
import { ErrorTypeEnum } from "@/constants";
import { notificationService, redisService } from "@/services";
import type { GoogleUser } from "@/types";
import { comparePassword, generateAccessToken, generateRefreshToken, verifyJWTToken } from "@/utils";

import { AuditLogService } from "../audit/audit-log.service.js";
import { ProfileService } from "../profile/profile.service.js";
import { SessionDAL } from "../session/session.dal.js";

interface GenerateTokenParams {
  userId: ObjectId;
  deviceInfo: DeviceInfo;
  deviceId: DeviceId;
  tokenVersion: number;
}

export class AuthService {
  public static async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const newUser = await UserService.registerUser(userData);

    AuditLogService.log(newUser.id, "auth.register", {
      metadata: { email: userData.email, username: userData.username },
    });

    await OtpService.sendOtp({
      email: userData.email,
      eventType: otpEvents.enum.EMAIL_VERIFICATION,
    });

    // Generate a temporary token for email verification
    const tokenService = new TokenService();
    const actionToken = await tokenService.createActionToken(newUser.id, userActions.enum.VERIFY_EMAIL);

    // Return the verification token along with the success message
    return { actionToken, userId: newUser.id };
  }

  public static async signInWithEmailOrUsernameAndPassword(
    loginData: LoginRequest,
    deviceInfo: DeviceInfo,
    deviceId: DeviceId
  ): Promise<AuthToken> {
    const user = await UserDAL.getUser(loginData);

    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    // Guard clause for OAuth-only users
    if (!user.password) {
      // SCENARIO: User exists but has no password (signed up via Google/Facebook)
      throw new Error(ErrorTypeEnum.enum.SOCIAL_LOGIN_REQUIRED);
    }

    const isPasswordMatch = await comparePassword(loginData.password, user.password);

    if (!isPasswordMatch) throw new Error(ErrorTypeEnum.enum.INVALID_CREDENTIALS);

    if (user.isDeleted) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    if (!user.isEmailVerified) throw new Error(ErrorTypeEnum.enum.EMAIL_NOT_VERIFIED);

    AuditLogService.log(user.id, `auth.login.${loginData.email ? "email" : "username"}`, {
      ip: deviceInfo.ip,
      metadata: {
        browser: deviceInfo.browser?.name,
        os: deviceInfo.os?.name,
      },
    });

    return await this.generateAccessAndRefreshToken({
      userId: user.id,
      deviceInfo: deviceInfo,
      deviceId: deviceId,
      tokenVersion: 0,
    });
  }

  public static async signInWithGoogle(
    googleUser: GoogleUser,
    deviceInfo: DeviceInfo,
    deviceId: DeviceId
  ): Promise<AuthToken> {
    const { id: googleId, emails, name, photos, displayName } = googleUser;
    const [{ value, verified: isEmailVerified }] = emails;
    const email: Email = value as Email;

    // Check if the user exists by Google ID
    let user = await UserService.getUserByGoogleId(googleId);

    if (!user) {
      // Check if the user exists by email
      const existingUser = await UserDAL.getUserByEmail(email);

      if (existingUser) {
        user = await UserService.updateUser(existingUser.id, {
          googleId,
          email,
        });
      } else {
        // Create new user
        const validaUsername = name.givenName.toLowerCase().replace(/\s+/g, "-");
        const username = await UserService.generateUniqueUsername(usernameSchema.parse(validaUsername));

        user = await UserService.registerUser({
          email,
          username,
          googleId,
          isEmailVerified,
        });

        // Create profile with Google data
        await new ProfileService().upSertProfileData({
          userId: user.id,
          name: displayName,
          givenName: name.givenName,
          familyName: name.familyName,
          avatar: photos?.[0]?.value,
        });
      }
    }

    AuditLogService.log(user.id, "auth.login.google", {
      sessionId: deviceId,
      ip: deviceInfo.ip,
      metadata: {
        browser: deviceInfo.browser?.name,
        os: deviceInfo.os?.name,
      },
    });

    return await this.generateAccessAndRefreshToken({
      userId: user.id,
      deviceInfo: deviceInfo,
      deviceId: deviceId,
      tokenVersion: 0,
    });
  }

  public static async logout(accessToken: string): Promise<void> {
    const res = await verifyJWTToken<AccessTokenPayload>(accessToken, TokenType.AUTHORIZATION);
    const { userId, deviceId, jti, exp } = res;

    if (jti == null || exp == null) {
      throw new Error(ErrorTypeEnum.enum.INVALID_TOKEN);
    }

    const isRevoked = await redisService.isJtiRevoked(jti);
    if (isRevoked) {
      throw new Error(ErrorTypeEnum.enum.TOKEN_REVOKED);
    }

    // Add JTI to Redis blacklist
    await redisService.revokeJti(jti, exp);

    // Deactivate the specific session
    const session = await new SessionDAL().updateSessionByUserAndDevice(userId, deviceId, { isActive: false });

    AuditLogService.log(userId, "auth.logout", { sessionId: session?.id });
  }

  public static async logoutAll(userId: ObjectId): Promise<{ modifiedCount?: number }> {
    // Increment tokenVersion for all sessions and deactivate them
    const sessions = await new SessionDAL().getSessionsByUserId(userId);

    for (const session of sessions) {
      await new SessionDAL().updateSessionByUserAndDevice(session.userId, session.deviceId, {
        isActive: false,
        tokenVersion: session.tokenVersion + 1,
      });
      // Update Redis cache for tokenVersion
      await redisService.setUserDeviceTokenVersion(
        session.userId.toString(),
        session.deviceId,
        session.tokenVersion + 1
      );
    }

    AuditLogService.log(userId, "auth.logout.all", {
      metadata: { sessionCount: sessions.length },
    });

    return { modifiedCount: sessions.length };
  }

  public static async logoutOthers(deviceId: string, userId: ObjectId): Promise<{ modifiedCount?: number }> {
    // Increment tokenVersion for all sessions except current and deactivate them
    const sessions = await new SessionDAL().getSessionsByUserId(userId);

    let modifiedCount = 0;
    for (const session of sessions) {
      if (session.deviceId !== deviceId.toString()) {
        await new SessionDAL().updateSessionByUserAndDevice(session.userId, session.deviceId, {
          isActive: false,
          tokenVersion: session.tokenVersion + 1,
        });
        // Update Redis cache for tokenVersion
        await redisService.setUserDeviceTokenVersion(
          session.userId.toString(),
          session.deviceId,
          session.tokenVersion + 1
        );
        modifiedCount++;
      }
    }

    AuditLogService.log(userId, "auth.logout.others", {
      metadata: { sessionCount: modifiedCount, deviceId },
    });

    return { modifiedCount };
  }

  public static async getSessions(userId: ObjectId, options: SessionQueryOptions) {
    return await new SessionDAL().getActiveSessionsByUserId(userId, options);
  }

  public static async verifyAccessToken(token: string): Promise<AuthenticatedUser> {
    const { userId, permissions, jti, tokenVersion, deviceId } = await verifyJWTToken<AccessTokenPayload>(
      token,
      TokenType.AUTHORIZATION
    );

    if (jti == null) {
      throw new Error(ErrorTypeEnum.enum.INVALID_TOKEN);
    }

    const isRevoked = await redisService.isJtiRevoked(jti);
    if (isRevoked) {
      throw new Error(ErrorTypeEnum.enum.TOKEN_REVOKED);
    }

    // Check tokenVersion from Redis to avoid DB call
    const currentTokenVersion = await redisService.getUserDeviceTokenVersion(userId.toString(), deviceId);

    if (currentTokenVersion !== null && tokenVersion < currentTokenVersion) {
      throw new Error(ErrorTypeEnum.enum.TOKEN_NOT_ACTIVE);
    }

    return { userId, permissions, deviceId, tokenVersion };
  }

  public static async resetPassword({ actionToken, password }: ResetPasswordRequest): Promise<void> {
    const tokenService = new TokenService();
    const { userId, id: tokenId } = await tokenService.verifyActionToken(actionToken, userActions.enum.RESET_PASSWORD);

    const user = await UserService.updateUser(userId, { password });

    await tokenService.invalidateToken(tokenId);

    await notificationService.sendEmail({
      to: user.email,
      eventType: emailNotificationEvents.enum.PASSWORD_CHANGE_CONFIRMATION,
      payload: { recipientName: user.username },
      subject: "Password Changed",
    });

    AuditLogService.log(userId, "auth.password.reset", {});
  }

  public static async changePassword(
    userId: ObjectId,
    { currentPassword, password }: ChangePasswordRequest
  ): Promise<void> {
    const user = await UserDAL.getUserById(userId);

    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    if (user.password && currentPassword) {
      const isPasswordMatch = await comparePassword(currentPassword, user.password as string);
      if (!isPasswordMatch) throw new Error(ErrorTypeEnum.enum.INVALID_CURRENT_PASSWORD);
    }

    const updatedUser = await UserService.updateUser(userId, { password });

    await notificationService.sendEmail({
      to: updatedUser.email,
      eventType: emailNotificationEvents.enum.PASSWORD_CHANGE_CONFIRMATION,
      payload: { recipientName: updatedUser.username },
      subject: "Password Changed",
    });

    AuditLogService.log(userId, "auth.password.change", {});
  }

  public static async refreshToken(incomingRefreshToken: string) {
    // 1. Verify the incoming token structure
    const decoded = await verifyJWTToken<RefreshTokenPayload>(incomingRefreshToken, TokenType.REFRESH);
    const { sessionId } = decoded;

    if (sessionId == null) throw new Error(ErrorTypeEnum.enum.INVALID_TOKEN);

    // 2. Fetch the EXISTING session
    const sessionDAL = new SessionDAL();
    const session = await sessionDAL.getSessionById(sessionId);

    // 3. Validation
    if (!session) throw new Error(ErrorTypeEnum.enum.SESSION_NOT_FOUND);
    if (!session.isActive) throw new Error(ErrorTypeEnum.enum.SESSION_INACTIVE);

    // 4. 🚨 SECURITY: Refresh Token Reuse Detection
    if (session.refreshToken !== incomingRefreshToken) {
      await sessionDAL.updateSession(sessionId, { isActive: false });

      AuditLogService.log(session.userId, "auth.token.refresh.fail", {
        sessionId: session.id.toString(),
        metadata: { reason: "token_reuse_detected" },
      });

      throw new Error(ErrorTypeEnum.enum.SECURITY_TOKEN_REUSE_DETECTED);
    }

    // 5. Rotate the token and increment version
    const newTokenVersion = session.tokenVersion + 1;
    const newRefreshToken = generateRefreshToken({ sessionId: session.id });

    const updatedSession = await sessionDAL.updateSession(sessionId, {
      refreshToken: newRefreshToken,
      lastActive: new Date(),
      tokenVersion: newTokenVersion,
    });

    if (!updatedSession) throw new Error(ErrorTypeEnum.enum.SESSION_NOT_FOUND);

    // auth.token.refresh is disabled as too noisy (per user request)

    // 6. Sync with Redis and Generate Tokens
    return await this.syncSessionAndGenerateTokens(updatedSession);
  }

  public static async autoLogin({ actionToken }: AutoLoginRequest): Promise<AuthToken> {
    const tokenService = new TokenService();
    const { userId, id: tokenId } = await tokenService.verifyActionToken(actionToken, userActions.enum.AUTO_LOGIN);

    const deviceId: DeviceId = crypto.randomUUID() as DeviceId;
    const deviceInfo = {} as DeviceInfo;

    const authToken = await this.generateAccessAndRefreshToken({
      userId,
      deviceInfo,
      deviceId,
      tokenVersion: 0,
    });

    // Invalidate the action token after use
    await tokenService.invalidateToken(tokenId);

    AuditLogService.log(userId, "auth.login.auto", {
      sessionId: deviceId,
    });

    return authToken;
  }

  private static async generateAccessAndRefreshToken({
    userId,
    deviceInfo,
    deviceId,
    tokenVersion,
  }: GenerateTokenParams) {
    const sessionDAL = new SessionDAL();

    // 1. Find existing session for this device
    const existingSession = await sessionDAL.getSessionByUserAndDevice(userId, deviceId);
    let session: Session;

    if (existingSession) {
      session = await sessionDAL.upsertSession(userId, deviceId, deviceInfo, existingSession.tokenVersion ?? 0);
    } else {
      session = await sessionDAL.upsertSession(userId, deviceId, deviceInfo, tokenVersion);
    }

    // 3. Finalize: Sync Redis and Generate Tokens
    return await this.syncSessionAndGenerateTokens(session);
  }

  /**
   * Helper to synchronize session state with Redis and generate access tokens.
   */
  private static async syncSessionAndGenerateTokens(session: Session) {
    const { userId, deviceId, tokenVersion, refreshToken } = session;

    // 1. Fetch latest permissions
    const accessProfile = await UserDAL.getUserAccessControl(userId);

    // 2. Sync with Redis (for fast Access Token validation)
    await redisService.setUserDeviceTokenVersion(userId.toString(), deviceId, tokenVersion);

    // 3. Generate Access Token
    const accessToken = generateAccessToken({
      userId,
      deviceId,
      tokenVersion,
      permissions: accessProfile.permissions,
    });

    return {
      userId,
      accessToken,
      refreshToken,
      deviceId,
      deviceInfo: session.deviceInfo,
    };
  }
}
