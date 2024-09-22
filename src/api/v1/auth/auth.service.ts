import { ErrorTypeEnum } from "@/constants";
import { comparePassword, generateAccessToken, generateRefreshToken, validateObjectId } from "@/utils";
import { UserDAL } from "@/api/v1/user/user.dal";
import { UserService } from "@/api/v1/user/user.service";
import {
  CreateUser,
  Email,
  ResetPassword,
  validateEmail,
  validateResetPasswordSchema,
} from "@/api/v1/user/user.validation";
import { AuthDAL } from "./auth.dal";
import { loginSchema, Login, AuthToken, Auth } from "./auth.validation";
import { OtpService } from "@/api/v1/otp/otp.service";
import { GoogleUser } from "@/types/passport-google";
import { TokenAction, TokenService } from "@/api/v1/token";
import { notificationService } from "@/services";

export class AuthService {
  public static async signUp(userData: CreateUser) {
    await UserService.createUser(userData);

    await OtpService.sendOtp({
      email: userData.email,
      otpType: "sendEmailVerificationOTP",
    });
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
    const { id: googleId, emails, name } = googleUser;
    const primaryEmail = emails[0];

    if (!primaryEmail?.value) {
      throw new Error("Email not provided by Google authentication");
    }

    const email = primaryEmail.value;
    const isEmailVerified = primaryEmail.verified;

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
        const username = await UserService.generateUniqueUsername(name.givenName.replace(" ", "-"));
        userRecord = await UserService.createUser({
          email,
          username,
          googleId,
          isEmailVerified,
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
    await OtpService.sendOtp({ email, otpType: "sendForgetPasswordOTP" });
  }

  public static async resetPassword(resetPassword: ResetPassword) {
    const { password, token } = validateResetPasswordSchema(resetPassword);

    const { userId } = await new TokenService().verifyActionToken(token, TokenAction.resetPassword);

    const user = await UserService.updateUser(userId, { password });

    notificationService.sendEmail({
      to: user.email,
      eventType: "sendPasswordChangeConfirmation",
    });
  }

  static async generateAccessAndRefreshToken(userId: string) {
    validateObjectId(userId);

    const refreshToken = generateRefreshToken({ id: userId });
    const accessToken = generateAccessToken({ userId });

    await AuthDAL.upsertAuthTokens({ userId, refreshToken });

    return { userId, accessToken, refreshToken };
  }
}
