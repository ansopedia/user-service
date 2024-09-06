import supertest from 'supertest';
import { app } from '@/app';
import { success } from '../user-role.constant';
import { expectLoginSuccess, expectSignUpSuccess, login, signUp, verifyAccount, createRoleRequest } from '@/utils/test';
import { createRole } from '../../role/role.validation';

const VALID_ROLE: createRole = {
  name: 'new-role',
  description: 'this is super admin creating first time',
  createdBy: '65f6dac9156e93e7b6f1b88d',
  isSystemRole: false,
  isDeleted: false,
};

const VALID_CREDENTIALS = {
  username: 'username',
  email: 'validemail@example.com',
  password: 'ValidPassword123!',
  confirmPassword: 'ValidPassword123!',
};

describe('User Role Test', () => {
  let authorizationHeader: string;
  let loggedInUserId: string;

  beforeAll(async () => {
    const response = await signUp(VALID_CREDENTIALS);
    expectSignUpSuccess(response);

    await verifyAccount(VALID_CREDENTIALS);

    const loginResponse = await login(VALID_CREDENTIALS);
    expectLoginSuccess(loginResponse);
    loggedInUserId = loginResponse.body.userId;
    authorizationHeader = `Bearer ${loginResponse.header['authorization']}`;
  });

  it('should create a new role permission', async () => {
    const { body: roleBody } = await createRoleRequest(VALID_ROLE, authorizationHeader);

    const userRole = {
      roleId: roleBody.role.id,
      userId: loggedInUserId,
    };

    const { body } = await supertest(app).post('/api/v1/user-role').send(userRole);

    expect(body).toMatchObject({
      message: success.USER_ROLE_CREATED_SUCCESSFULLY,
      userRole: {
        roleId: userRole.roleId,
        userId: userRole.userId,
      },
    });
  });
});
