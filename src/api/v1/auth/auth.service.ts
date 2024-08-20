import { ErrorTypeEnum } from '@/constants';
import { comparePassword, generateAccessToken, generateRefreshToken } from '@/utils';
import { UserDAL } from '../user/user.dal';
import { UserService } from '../user/user.service';
import { CreateUser, User } from '../user/user.validation';
import { AuthDAL } from './auth.dal';
import { loginSchema, Login, AuthToken } from './auth.validation';
import { OtpService } from '../otp/otp.service';

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

  public static async signOut(userId: string) {
    return await AuthDAL.deleteAuth(userId);
  }

  public static async renewToken({ id: userId }: User): Promise<AuthToken> {
    const newRefreshToken = generateRefreshToken({ id: userId });
    const newAccessToken = generateAccessToken({ userId });

    await AuthDAL.updateOrCreateAuthTokens({ userId, refreshToken: newRefreshToken });

    return { userId, accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
