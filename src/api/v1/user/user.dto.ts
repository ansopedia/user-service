import { getUser, User } from './user.validation';

export const UserDto = (user: User) => ({
  getUser: (): getUser => {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },
  createUser: () => {
    return {
      username: user.username,
      email: user.email,
      password: user.password,
    };
  },
  updateUser: () => {
    return {
      username: user.username,
      email: user.email,
      password: user.password,
    };
  },
  deleteUser: () => {
    return {
      username: user.username,
      email: user.email,
    };
  },
});
