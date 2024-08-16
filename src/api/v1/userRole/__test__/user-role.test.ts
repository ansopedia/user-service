import supertest from 'supertest';
import { app } from '@/server';
import { success } from '../user-role.constant';
import { setupInitialRolesAndPermissions } from '../../../../script/initialize';

const VALID_ROLE = {
  name: 'new-role',
  description: 'this is super admin creating first time',
  createdBy: '65f6dac9156e93e7b6f1b88d',
};

const VALID_CREDENTIALS = {
  username: 'username',
  email: 'validemail@example.com',
  password: 'ValidPassword123!',
  confirmPassword: 'ValidPassword123!',
};

describe('User Role Test', () => {
  beforeAll(async () => {
    await setupInitialRolesAndPermissions();
  });

  it('should create a new role permission', async () => {
    const { body: roleBody } = await supertest(app).post('/api/v1/roles').send(VALID_ROLE);
    const { body: userBody } = await supertest(app).post('/api/v1/users').send(VALID_CREDENTIALS);

    const userRole = {
      roleId: roleBody.role.id,
      userId: userBody.user.id,
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
