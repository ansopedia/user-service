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
  }

  public static async changePassword(
    userId: ObjectId,
    { currentPassword, password }: ChangePasswordRequest
  ): Promise<void> {
    const user = await UserDAL.getUserById(userId);

    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    const isPasswordMatch = await comparePassword(currentPassword, user.password);

    if (!isPasswordMatch) throw new Error(ErrorTypeEnum.enum.INVALID_CURRENT_PASSWORD);

    const updatedUser = await UserService.updateUser(userId, { password });

    await notificationService.sendEmail({
      to: updatedUser.email,
      eventType: emailNotificationEvents.enum.PASSWORD_CHANGE_CONFIRMATION,
      payload: { recipientName: updatedUser.username },
      subject: "Password Changed",
    });
  }

  public static async refreshToken(incomingRefreshToken: string) {
    // 1. Verify the incoming token structure
    const decoded = await verifyJWTToken<RefreshTokenPayload>(incomingRefreshToken, TokenType.REFRESH);
    const { sessionId, jti, exp } = decoded;

    if (jti == null || exp == null) {
      throw new Error(ErrorTypeEnum.enum.INVALID_TOKEN);
    }

    if (sessionId == null) throw new Error(ErrorTypeEnum.enum.INVALID_TOKEN);

    // 2. Fetch the EXISTING session (Do not create new)
    const session = await new SessionDAL().getSessionById(sessionId);

    // 3. Validation
    if (!session) throw new Error(ErrorTypeEnum.enum.SESSION_NOT_FOUND);
    if (!session.isActive) throw new Error(ErrorTypeEnum.enum.SESSION_INACTIVE);

    // 4. 🚨 SECURITY: Refresh Token Reuse Detection
    // If the token coming from the client doesn't match what we have in the DB,
    // it means an old (stolen) token is being reused.
    if (session.refreshToken !== incomingRefreshToken) {
      // Nuclear option: Invalidate the session immediately to stop the attacker
      await new SessionDAL().updateSession(sessionId, { isActive: false });
      throw new Error(ErrorTypeEnum.enum.SECURITY_TOKEN_REUSE_DETECTED);
    }

    // 5. Generate NEW Tokens
    const newAccessProfile = await UserDAL.getUserAccessControl(session.userId);

    // We increment version to invalidate old Access Tokens immediately
    const newTokenVersion = session.tokenVersion + 1;

    // 6. UPDATE the existing session (Rotate the token)
    // We update the Refresh Token string and the Last Active time
    const newRefreshToken = generateRefreshToken({
      sessionId: session.id, // Keep the SAME Session ID
      // userId: session.userId,
      // tokenVersion: newTokenVersion,
    });

    await new SessionDAL().updateSession(sessionId, {
      refreshToken: newRefreshToken, // Save the new "Key"
      lastActive: new Date(),
      tokenVersion: newTokenVersion,
      deviceInfo: session.deviceInfo, // Optional: Update IP/Location if changed
    });

    // 7. Sync with Redis (for fast Access Token validation)
    await redisService.setUserDeviceTokenVersion(session.userId.toString(), session.deviceId, newTokenVersion);

    const newAccessToken = generateAccessToken({
      userId: session.userId,
      deviceId: session.deviceId,
      tokenVersion: newTokenVersion,
      permissions: newAccessProfile.permissions,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken, // Send new rotation key
      deviceId: session.deviceId,
    };
  }

  public static async autoLogin({ actionToken }: AutoLoginRequest): Promise<AuthToken> {
    const tokenService = new TokenService();
    const { userId, id: tokenId } = await tokenService.verifyActionToken(actionToken, userActions.enum.AUTO_LOGIN);

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

    const accessProfile = await UserDAL.getUserAccessControl(userId);

    const accessToken = generateAccessToken({
      userId: userId,
      deviceId: deviceId,
      tokenVersion: session.tokenVersion,
      permissions: accessProfile.permissions,
    });

    return { userId, accessToken, refreshToken: session.refreshToken };
  }
}
