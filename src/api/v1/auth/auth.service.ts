import { OtpService } from "@/api/v1/otp/otp.service.js";
import { TokenService } from "@/api/v1/token/index.js";
import { UserDAL } from "@/api/v1/user/user.dal.js";
import { UserService } from "@/api/v1/user/user.service.js";
import { type RegisterSchema, type ResetPassword, type UserRolePermission } from "@/api/v1/user/user.validation.js";
import { ErrorTypeEnum, NotificationType, type Permission, UserActionType } from "@/constants";
import { notificationService, redisService } from "@/services";
import type { GoogleUser } from "@/types";
import { type DeviceId, type DeviceInfo, type Email, type LoggedInUser, type MongooseObjectId, Tokens } from "@/types";
import { comparePassword, generateAccessToken, verifyJWTToken } from "@/utils";

import { ProfileService } from "../profile/profile.service.js";
import { SessionDAL } from "../session/session.dal.js";
import { AuthDAL } from "./auth.dal.js";
import {
  type AccessTokenPayload,
  type AuthToken,
  type Login,
  type RefreshTokenPayload,
  type SignUpResponse,
} from "./auth.validation.js";

interface GenerateTokenParams {
  userId: MongooseObjectId;
  deviceInfo: DeviceInfo;
  deviceId: DeviceId;
  tokenVersion: number;
}

export class AuthService {
  public static async register(userData: RegisterSchema): Promise<SignUpResponse> {
    const newUser = await UserService.registerUser(userData);

    await OtpService.sendOtp({
      email: userData.email,
      otpType: NotificationType.EMAIL_VERIFICATION_OTP,
    });

    // Generate a temporary token for email verification
    const tokenService = new TokenService();
    const token = await tokenService.createActionToken(newUser.id, UserActionType.VERIFY_EMAIL);

    // Return the verification token along with the success message
    return { token, userId: newUser.id };
  }

  public static async signInWithEmailOrUsernameAndPassword(
    loginData: Login,
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
        const username = await UserService.generateUniqueUsername(name.givenName.toLowerCase().replace(/\s+/g, "-"));

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

  public static async logout(accessToken: string, sessionId: MongooseObjectId): Promise<void> {
    const res = await verifyJWTToken<AccessTokenPayload>(accessToken, Tokens.ACCESS);
    const { userId, jti, exp } = res;

    if (jti == null || exp == null) {
      throw new Error(ErrorTypeEnum.enum.INVALID_TOKEN);
    }

    const isRevoked = await redisService.isJtiRevoked(jti);
    if (isRevoked) {
      throw new Error(ErrorTypeEnum.enum.TOKEN_REVOKED);
    }

    // Add JTI to Redis blacklist
    await redisService.revokeJti(jti, exp);

    // Remove from database
    const deletedSession = await AuthDAL.deleteAuthBySessionIdAndUserId(sessionId, userId);
    if (!deletedSession) {
      throw new Error(ErrorTypeEnum.enum.SESSION_NOT_FOUND);
    }
  }

  public static async logoutAll(userId: MongooseObjectId): Promise<{ deletedCount?: number }> {
    // TODO: Implement Token Revocation List Using Redis  to Invalidate Access Tokens on Logout

    return await AuthDAL.deleteAllAuthsByUserId(userId);
  }

  public static async logoutOthers(
    sessionId: MongooseObjectId,
    userId: MongooseObjectId
  ): Promise<{ deletedCount?: number }> {
    // TODO: Implement Token Revocation List Using Redis  to Invalidate Access Tokens on Logout

    return await AuthDAL.deleteAllExceptSessionId(userId, sessionId);
  }

  public static async getSessions(userId: MongooseObjectId) {
    return await AuthDAL.getAuthsByUserId(userId);
  }

  public static async verifyAccessToken(token: string): Promise<LoggedInUser> {
    const { userId, permissions, jti, tokenVersion, deviceId } = await verifyJWTToken<AccessTokenPayload>(
      token,
      Tokens.ACCESS
    );

    if (jti == null) {
      throw new Error(ErrorTypeEnum.enum.INVALID_TOKEN);
    }

    const isRevoked = await redisService.isJtiRevoked(jti);
    if (isRevoked) {
      throw new Error(ErrorTypeEnum.enum.TOKEN_REVOKED);
    }

    return { userId, permissions, deviceId, tokenVersion };
  }

  public static async forgetPassword(email: Email) {
    return await OtpService.sendOtp({
      email,
      otpType: NotificationType.FORGET_PASSWORD_OTP,
    });
  }

  public static async resetPassword({ token, password }: ResetPassword): Promise<void> {
    const tokenService = new TokenService();
    const { userId, id: tokenId } = await tokenService.verifyActionToken(token, UserActionType.RESET_PASSWORD);

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
    const { sessionId } = await verifyJWTToken<RefreshTokenPayload>(refreshToken, Tokens.REFRESH);

    const session = await new SessionDAL().getSessionById(sessionId);

    if (!session) {
      throw new Error(ErrorTypeEnum.Enum.SESSION_NOT_FOUND);
    }

    const updatedSession = await new SessionDAL().updateSession(sessionId);

    if (!updatedSession) {
      throw new Error(ErrorTypeEnum.Enum.SESSION_NOT_FOUND);
    }

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
      userId: updatedSession.userId,
      accessToken,
      refreshToken: updatedSession.refreshToken,
      deviceId: updatedSession.deviceId,
    };
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
