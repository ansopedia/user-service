import { defaultUsers } from '@/constants';
import {
  createUser,
  deleteUser,
  expectDeleteUserSuccess,
  expectUserNotFoundError,
  expectFindUserByUsernameSuccess,
  expectLoginSuccess,
  expectUnauthorizedResponseForInvalidAuthorizationHeader,
  expectUnauthorizedResponseForMissingAuthorizationHeader,
  expectUnauthorizedResponseWhenUserHasInsufficientPermission,
  expectUserCreationSuccess,
  findUserByUsername,
  login,
  verifyAccount,
  expectBadRequestResponseForValidationError,
} from '@/utils/test';
import { GetUser } from '../user.validation';
import mongoose from 'mongoose';

const newUser = {
  username: 'username',
  email: 'validemail@example.com',
  password: 'ValidPassword123!',
  confirmPassword: 'ValidPassword123!',
};

describe('Soft Delete User', () => {
  let authorizationHeader: string;
  let userToDelete: GetUser;

  beforeAll(async () => {
    const loginResponse = await login(defaultUsers);
    expectLoginSuccess(loginResponse);
    authorizationHeader = `Bearer ${loginResponse.header['authorization']}`;

    const userResponse = await createUser(newUser, authorizationHeader);
    expectUserCreationSuccess(userResponse, newUser);

    const foundUserRes = await findUserByUsername(newUser.username);
    expectFindUserByUsernameSuccess(foundUserRes, newUser);

    userToDelete = foundUserRes.body.user;
  });

  it('should return 401 for missing authorization header', async () => {
    const response = await deleteUser(userToDelete.id, '');
    expectUnauthorizedResponseForMissingAuthorizationHeader(response);
  });

  it('should return 401 for invalid authorization header', async () => {
    const response = await deleteUser(userToDelete.id, 'invalid');
    expectUnauthorizedResponseForInvalidAuthorizationHeader(response);
  });

  it('should return 400 for invalid user id', async () => {
    const response = await deleteUser('invalid', authorizationHeader);
    expectBadRequestResponseForValidationError(response);
  });

  it('should return 404 for user not found', async () => {
    const response = await deleteUser(new mongoose.Types.ObjectId().toHexString(), authorizationHeader);
    expectUserNotFoundError(response);
  });

  it('should return 403 for unauthorized user', async () => {
    const unAuthorizedUser = { ...newUser, username: 'unauthorized', email: 'unauthorized@gmail.com' };

    const createUserRes = await createUser(unAuthorizedUser, authorizationHeader);
    expectUserCreationSuccess(createUserRes, unAuthorizedUser);

    await verifyAccount(unAuthorizedUser);

    const loginResponse = await login(unAuthorizedUser);
    expectLoginSuccess(loginResponse);
    const header = `Bearer ${loginResponse.header['authorization']}`;

    const deleteUserRes = await deleteUser(userToDelete.id, header);
    expectUnauthorizedResponseWhenUserHasInsufficientPermission(deleteUserRes);
  });

  it('should soft delete user', async () => {
    const response = await deleteUser(userToDelete.id, authorizationHeader);
    expectDeleteUserSuccess(response);
  });
});
