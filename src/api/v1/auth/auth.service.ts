import { UserService } from '../user/user.service';
import { createUser } from '../user/user.validation';

export class AuthService {
  public static async signUp(userData: createUser) {
    await UserService.createUser(userData);

    // TODO: Send verification email
  }
}
