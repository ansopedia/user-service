import { OtpService } from "@/api/v1/otp/otp.service";
import { TokenAction, TokenService } from "@/api/v1/token";
import { UserDAL } from "@/api/v1/user/user.dal";
import { UserService } from "@/api/v1/user/user.service";
import {
  CreateUser,
  Email,
  ResetPassword,
  validateEmail,
  validateResetPasswordSchema,
} from "@/api/v1/user/user.validation";
import { ErrorTypeEnum, Permission } from "@/constants";
import { EmailEventType, notificationService } from "@/services";
import { GoogleUser } from "@/types/passport-google";
import { comparePassword, generateAccessToken, generateRefreshToken, validateObjectId } from "@/utils";

import { ProfileService } from "../profile";
import { AuthDAL } from "./auth.dal";
import { Auth, AuthToken, Login, loginSchema } from "./auth.validation";

export class AuthService {
  public static async signUp(userData: CreateUser) {
    const newUser = await UserService.createUser(userData);

    await OtpService.sendOtp({
      email: userData.email,
      otpType: EmailEventType.sendEmailVerificationOTP,
    });

    // Generate a temporary token for email verification
    const tokenService = new TokenService();
    const emailVerificationToken = await tokenService.createActionToken(newUser.id, TokenAction.verifyEmail);

    // Return the verification token along with the success message
    return { emailVerificationToken };
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

  public static async logout(userId: string) {
    validateObjectId(userId);
    return await AuthDAL.deleteAuth(userId);
  }

  public static async verifyToken(userId: string): Promise<Auth> {
    validateObjectId(userId);
    const user = await AuthDAL.getAuthByUserId(userId);

    if (!user) throw new Error(ErrorTypeEnum.enum.UNAUTHORIZED);

    return user;
  }

  public static async forgetPassword(email: Email) {
    validateEmail(email);
    return await OtpService.sendOtp({ email, otpType: "sendForgetPasswordOTP" });
  }

  public static async resetPassword(resetPassword: ResetPassword) {
    const { password, token } = validateResetPasswordSchema(resetPassword);

    const { userId } = await new TokenService().verifyActionToken(token, TokenAction.resetPassword);

    const user = await UserService.updateUser(userId, { password });

    await notificationService.sendEmail({
      to: user.email,
      eventType: EmailEventType.sendPasswordChangeConfirmation,
      payload: { recipientName: user.username },
    });
  }

  static async generateAccessAndRefreshToken(userId: string) {
    validateObjectId(userId);
    const userRolePermissions = await UserDAL.getUserRolesAndPermissionsByUserId(userId);

    // Generate both tokens concurrently
    const [accessToken, refreshToken] = await Promise.all([
      generateAccessToken({
        userId,
        permissions: userRolePermissions.allPermissions.map(({ name }) => name) as Permission[],
      }),
      generateRefreshToken({ id: userId }),
    ]);

    await AuthDAL.upsertAuthTokens({ userId, refreshToken });

    return { userId, accessToken, refreshToken };
  }
}
