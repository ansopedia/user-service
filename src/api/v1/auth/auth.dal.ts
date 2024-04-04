import { ValidMongoId } from '../../../utils/validation.util';
import { AuthModel } from './auth.modal';

export class AuthDAL {
  static async saveAuthTokens(userId: ValidMongoId, accessToken: string, refreshToken: string) {
    await AuthModel.create({ userId, accessToken, refreshToken });
  }
}
