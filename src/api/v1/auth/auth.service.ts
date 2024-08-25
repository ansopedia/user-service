import { ErrorTypeEnum } from '@/constants';
import { comparePassword, generateAccessToken, generateRefreshToken, validateMongoId } from '@/utils';
import { UserDAL } from '../user/user.dal';
import { UserService } from '../user/user.service';
import { CreateUser, User } from '../user/user.validation';
import { AuthDAL } from './auth.dal';
import { loginSchema, Login, AuthToken } from './auth.validation';
import { OtpService } from '../otp/otp.service';
import { GoogleUser } from '@/types/passport-google';

export class AuthService {
  public static async signUp(userData: CreateUser) {
    await UserService.createUser(userData);

    await OtpService.sendOtp({ email: userData.email, otpType: 'sendEmailVerificationOTP' });
  }

  public static async signInWithEmailAndPassword(userData: Login): Promise<AuthToken> {
    const validUserData = loginSchema.parse(userData);

    const user = await UserDAL.getUserByEmail(validUserData.email);

    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    const isPasswordMatch = await comparePassword(validUserData.password, user.password);

    if (!isPasswordMatch) throw new Error(ErrorTypeEnum.enum.INVALID_CREDENTIALS);

    if (user.isDeleted) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    if (!user.isEmailVerified) throw new Error(ErrorTypeEnum.enum.EMAIL_NOT_VERIFIED);

    const userId = user.id;

    const refreshToken = generateRefreshToken({ id: userId });
    const accessToken = generateAccessToken({ userId });

    await AuthDAL.updateOrCreateAuthTokens({ userId, refreshToken });

    return { userId, accessToken, refreshToken };
  }

  public static async signInWithGoogle(googleUser: GoogleUser): Promise<AuthToken> {
    const { id: googleId, emails, name } = googleUser;
    const primaryEmail = emails[0];

    if (!primaryEmail?.value) {
      throw new Error('Email not provided by Google authentication');
    }

    const email = primaryEmail.value;
    const isEmailVerified = primaryEmail.verified;

    // Check if the user exists by Google ID
    let userRecord = await UserService.getUserByGoogleId(googleId);

    if (!userRecord) {
      // Check if the user exists by email
      const existingUser = await UserDAL.getUserByEmail(email);

      if (existingUser) {
        userRecord = await UserService.updateUser(existingUser.id, { googleId, email });
      } else {
        const username = await UserService.generateUniqueUsername(name.givenName.replace(' ', '-'));
        userRecord = await UserService.createUser({
          email,
          username,
          googleId,
          isEmailVerified,
        });
      }
    }

    const userId = userRecord.id;
    const refreshToken = generateRefreshToken({ id: userId });
    const accessToken = generateAccessToken({ userId });

    await AuthDAL.updateOrCreateAuthTokens({ userId, refreshToken });

    return { userId: googleId, accessToken, refreshToken };
  }

  public static async signOut(userId: string) {
    validateMongoId.parse(userId);
    return await AuthDAL.deleteAuth(userId);
  }

  public static async verifyToken(userId: string) {
    validateMongoId.parse(userId);
    const user = await AuthDAL.getAuthByUserId(userId);

    if (!user) throw new Error(ErrorTypeEnum.enum.UNAUTHORIZED);

    return user;
  }

  public static async renewToken({ id: userId }: User): Promise<AuthToken> {
    const newRefreshToken = generateRefreshToken({ id: userId });
    const newAccessToken = generateAccessToken({ userId });

    await AuthDAL.updateOrCreateAuthTokens({ userId, refreshToken: newRefreshToken });

    return { userId, accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
