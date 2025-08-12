import { OtpService } from "@/api/v1/otp/otp.service";
import { TokenService } from "@/api/v1/token";
import { UserDAL } from "@/api/v1/user/user.dal";
import { UserService } from "@/api/v1/user/user.service";
import {
  CreateUser,
  Email,
  ResetPassword,
  UserRolePermission,
  validateEmail,
  validateResetPasswordSchema,
} from "@/api/v1/user/user.validation";
import { ErrorTypeEnum, NotificationType, Permission, UserActionType } from "@/constants";
import { notificationService, redisService } from "@/services";
import { LoggedInUser, Tokens } from "@/types";
import { GoogleUser } from "@/types/passport-google";
import { comparePassword, generateAccessToken, generateRefreshToken, validateObjectId, verifyJWTToken } from "@/utils";

import { ProfileService } from "../profile";
import { AuthDAL } from "./auth.dal";
import {
  Auth,
  AuthToken,
  JwtAccessToken,
  JwtRefreshToken,
  Login,
  SignUpResponse,
  loginSchema,
} from "./auth.validation";

export class AuthService {
  public static async signUp(userData: CreateUser): Promise<SignUpResponse> {
    const newUser = await UserService.createUser(userData);

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

  public static async signInWithEmailOrUsernameAndPassword(userData: Login): Promise<AuthToken> {
    const validUserData = loginSchema.parse(userData);

    const user = await UserDAL.getUser(validUserData);

    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    const isPasswordMatch = await comparePassword(validUserData.password, user.password);

    if (!isPasswordMatch) throw new Error(ErrorTypeEnum.enum.INVALID_CREDENTIALS);

    if (user.isDeleted) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    if (!user.isEmailVerified) throw new Error(ErrorTypeEnum.enum.EMAIL_NOT_VERIFIED);

    return await this.generateAccessAndRefreshToken(user.id);
  }

  public static async signInWithGoogle(googleUser: GoogleUser): Promise<AuthToken> {
    const { id: googleId, emails, name, photos, displayName } = googleUser;
    const [{ value: email, verified: isEmailVerified }] = emails;

    if (!email) {
      throw new Error("Email not provided by Google authentication");
    }

    // Check if the user exists by Google ID
    let userRecord = await UserService.getUserByGoogleId(googleId);

    if (!userRecord) {
      // Check if the user exists by email
      const existingUser = await UserDAL.getUserByEmail(email);

      if (existingUser) {
        userRecord = await UserService.updateUser(existingUser.id, {
          googleId,
          email,
        });
      } else {
        // Create new user
        const username = await UserService.generateUniqueUsername(name.givenName.toLowerCase().replace(/\s+/g, "-"));

        userRecord = await UserService.createUser({
          email,
          username,
          googleId,
          isEmailVerified,
        });

        // Create profile with Google data
        await new ProfileService().upSertProfileData({
          userId: userRecord.id,
          name: displayName,
          givenName: name.givenName,
          familyName: name.familyName,
          avatar: photos?.[0]?.value,
        });
      }
    }

    return await this.generateAccessAndRefreshToken(userRecord.id);
  }

  public static async logout(accessToken: string, sessionId: string): Promise<void> {
    const res = await verifyJWTToken<JwtAccessToken>(accessToken, Tokens.ACCESS);
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

  public static async logoutAll(userId: string): Promise<{ deletedCount?: number }> {
    // TODO: Implement Token Revocation List Using Redis  to Invalidate Access Tokens on Logout

    return await AuthDAL.deleteAllAuthsByUserId(userId);
  }

  public static async logoutOthers(sessionId: string, userId: string): Promise<{ deletedCount?: number }> {
    // TODO: Implement Token Revocation List Using Redis  to Invalidate Access Tokens on Logout

    return await AuthDAL.deleteAllExceptSessionId(userId, sessionId);
  }

  public static async getSessions(userId: string) {
    return await AuthDAL.getAuthsByUserId(userId);
  }

  static async verifyRefreshToken(refreshToken: string): Promise<Auth> {
    const { id } = await verifyJWTToken<JwtRefreshToken>(refreshToken, Tokens.REFRESH);

    const auth = await AuthDAL.getAuthByRefreshToken(refreshToken);

    if (!auth || auth.userId !== id) throw new Error(ErrorTypeEnum.enum.UNAUTHORIZED);
    return auth;
  }

  public static async verifyAccessToken(token: string): Promise<LoggedInUser> {
    const { userId, permissions, jti } = await verifyJWTToken<JwtAccessToken>(token, Tokens.ACCESS);

    if (jti == null) {
      throw new Error(ErrorTypeEnum.enum.INVALID_TOKEN);
    }

    const isRevoked = await redisService.isJtiRevoked(jti);
    if (isRevoked) {
      throw new Error(ErrorTypeEnum.enum.TOKEN_REVOKED);
    }

    return { userId, permissions };
  }

  public static async forgetPassword(email: Email) {
    validateEmail(email);
    return await OtpService.sendOtp({
      email,
      otpType: NotificationType.FORGET_PASSWORD_OTP,
    });
  }

  public static async resetPassword(resetPassword: ResetPassword): Promise<AuthToken> {
    const { password, token } = validateResetPasswordSchema(resetPassword);

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

    return await this.generateAccessAndRefreshToken(userId);
  }

  public static async renewAccessTokenFromRefreshToken(sessionId: string, refreshToken: string) {
    const { userId } = await this.verifyRefreshToken(refreshToken);

    const deletedSession = await AuthDAL.deleteAuthBySessionIdAndUserId(sessionId, userId);

    if (!deletedSession) {
      throw new Error(ErrorTypeEnum.enum.SESSION_NOT_FOUND);
    }

    return await this.generateAccessAndRefreshToken(userId);
  }

  static async generateAccessAndRefreshToken(userId: string) {
    validateObjectId(userId);
    const userRolePermissions: UserRolePermission = await UserDAL.getUserRolesAndPermissionsByUserId(userId);

    // Generate both tokens concurrently
    const accessToken = generateAccessToken({
      userId,
      permissions: userRolePermissions.allPermissions.map(({ name }) => name) as Permission[],
    });

    const refreshToken = generateRefreshToken({ id: userId });

    const newSession = await AuthDAL.insertAuthToken({ userId, refreshToken });

    return { userId, accessToken, refreshToken, sessionId: newSession.id };
  }
}
