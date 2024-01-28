import { IUser } from '../models/User';

export class UserDto {
  private user: IUser;

  constructor(user: IUser) {
    this.user = user;
  }

  getUserDetails() {
    return {
      userId: this.user._id,
      email: this.user.email,
      name: this.user.name,
      role: this.user.role,
      isAccountVerified: this.user.isAccountVerified,
      isProfileComplete: this.user.isProfileComplete,
    };
  }

  getUserDetailsForExternalServices() {
    return {
      userId: this.user._id,
      role: this.user.role,
      isAccountVerified: this.user.isAccountVerified,
    };
  }
}
