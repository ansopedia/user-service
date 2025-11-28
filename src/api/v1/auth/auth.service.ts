import {
  type AccessTokenPayload,
  type AuthToken,
  type AuthenticatedUser,
  type DeviceId,
  type DeviceInfo,
  type LoginRequest,
  type ObjectId,
  type RefreshTokenPayload,
  type RegisterRequest,
  type RegisterResponse,
  type ResetPasswordRequest,
  TokenType,
  type UserRolePermission,
  usernameSchema,
} from "@ansospace/types";

import { OtpService } from "@/api/v1/otp/otp.service.js";
import { TokenService } from "@/api/v1/token/index.js";
import { UserDAL } from "@/api/v1/user/user.dal.js";
import { UserService } from "@/api/v1/user/user.service.js";
import { ErrorTypeEnum, NotificationType, type Permission, UserActionType } from "@/constants";
import { notificationService, redisService } from "@/services";
import type { GoogleUser } from "@/types";
import { comparePassword, generateAccessToken, verifyJWTToken } from "@/utils";

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

    await OtpService.sendOtp({
      email: userData.email,
      otpType: NotificationType.EMAIL_VERIFICATION_OTP,
    });

    // Generate a temporary token for email verification
    const tokenService = new TokenService();
    const actionToken = await tokenService.createActionToken(newUser.id, UserActionType.VERIFY_EMAIL);

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

    const isPasswordMatch = await comparePassword(loginData.password, user.password);

    if (!isPasswordMatch) throw new Error(ErrorTypeEnum.enum.INVALID_CREDENTIALS);

    if (user.isDeleted) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    if (!user.isEmailVerified) throw new Error(ErrorTypeEnum.enum.EMAIL_NOT_VERIFIED);

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
    const [{ value: email, verified: isEmailVerified }] = emails;

    if (!email) {
      throw new Error("Email not provided by Google authentication");
    }

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
    await new SessionDAL().updateSessionByUserAndDevice(userId, deviceId, { isActive: false });
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

    return { modifiedCount };
  }

  public static async getSessions(userId: ObjectId) {
    return await new SessionDAL().getActiveSessionsByUserId(userId);
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
    const { userId, id: tokenId } = await tokenService.verifyActionToken(actionToken, UserActionType.RESET_PASSWORD);

    const user = await UserService.updateUser(userId, { password });

    await tokenService.invalidateToken(tokenId);

    await notificationService.sendEmail({
      to: user.email,
      eventType: NotificationType.PASSWORD_CHANGE_CONFIRMATION,
      payload: { recipientName: user.username },
      subject: "Password Changed",
    });
  }

  public static async refreshToken(refreshToken: string) {
    const res = await verifyJWTToken<RefreshTokenPayload>(refreshToken, TokenType.REFRESH);
    const { sessionId, jti, exp } = res;

    if (jti == null || exp == null) {
      throw new Error(ErrorTypeEnum.enum.INVALID_TOKEN);
    }

    const session = await new SessionDAL().getSessionById(sessionId);

    if (!session) {
      throw new Error(ErrorTypeEnum.enum.SESSION_NOT_FOUND);
    }

    if (!session.isActive) {
      throw new Error(ErrorTypeEnum.enum.SESSION_INACTIVE);
    }

    // Mark previous token/session inactive after renewing
    await new SessionDAL().updateSessionByUserAndDevice(session.userId, session.deviceId, { isActive: false });

    const updatedSession = await new SessionDAL().insertSession({
      userId: session.userId,
      deviceId: session.deviceId,
      deviceInfo: session.deviceInfo,
      lastActive: new Date(),
      tokenVersion: session.tokenVersion + 1,
    });

    // Cache tokenVersion in Redis
    await redisService.setUserDeviceTokenVersion(
      session.userId.toString(),
      session.deviceId,
      updatedSession.tokenVersion
    );

    const userRolePermissions: UserRolePermission = await UserDAL.getUserRolesAndPermissionsByUserId(
      updatedSession.userId
    );

    const accessToken = generateAccessToken({
      userId: updatedSession.userId,
      deviceId: updatedSession.deviceId,
      tokenVersion: updatedSession.tokenVersion,
      permissions: userRolePermissions.allPermissions.map(({ name }) => name) as Permission[],
    });

    return {
      accessToken,
      refreshToken: updatedSession.refreshToken,
      deviceId: updatedSession.deviceId,
    };
  }

  public static async autoLogin(actionToken: string): Promise<AuthToken> {
    const tokenService = new TokenService();
    const { userId, id: tokenId } = await tokenService.verifyActionToken(actionToken, UserActionType.AUTO_LOGIN);

    // For auto-login, we need device info, but since it's from OTP verification, we can use default or empty device info
    // To keep it simple, we'll use a default deviceId and empty deviceInfo
    const deviceId: DeviceId = crypto.randomUUID();
    const deviceInfo = {} as DeviceInfo;

    const authToken = await this.generateAccessAndRefreshToken({
      userId,
      deviceInfo,
      deviceId,
      tokenVersion: 0,
    });

    // Invalidate the action token after use
    await tokenService.invalidateToken(tokenId);

    return authToken;
  }

  private static async generateAccessAndRefreshToken({
    userId,
    deviceInfo,
    deviceId,
    tokenVersion,
  }: GenerateTokenParams) {
    const session = await new SessionDAL().insertSession({
      userId: userId,
      deviceId,
      deviceInfo: deviceInfo,
      lastActive: new Date(),
      tokenVersion,
    });

    const userRolePermissions: UserRolePermission = await UserDAL.getUserRolesAndPermissionsByUserId(userId);

    const accessToken = generateAccessToken({
      userId: userId,
      deviceId: deviceId,
      tokenVersion: session.tokenVersion,
      permissions: userRolePermissions.allPermissions.map(({ name }) => name) as Permission[],
    });

    return { userId, accessToken, refreshToken: session.refreshToken };
  }
}
