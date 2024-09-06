import supertest from 'supertest';
import { app } from '@/app';
import { success } from '../role-permission.constant';
import { createRole } from '../../role/role.validation';
import { createPermission, PermissionCategory } from '../../permission/permission.validation';
import {
  createRoleRequest,
  expectLoginSuccess,
  expectSignUpSuccess,
  login,
  signUp,
  verifyAccount,
} from '../../../../utils/test';

const VALID_ROLE: createRole = {
  name: 'new-role',
  description: 'this is super admin creating first time',
  createdBy: '65f6dac9156e93e7b6f1b88d',
  isDeleted: false,
  isSystemRole: false,
};

const VALID_PERMISSION: createPermission = {
  name: 'new-permissions',
  description: 'this is crete permission creating first time',
  createdBy: '65f6dac9156e93e7b6f1b88d',
  isDeleted: false,
  category: PermissionCategory.SYSTEM,
};

const VALID_CREDENTIALS = {
  username: 'username',
  email: 'validemail@example.com',
  password: 'ValidPassword123!',
  confirmPassword: 'ValidPassword123!',
};

describe('Role Permission Test', () => {
  let authorizationHeader: string;
  beforeAll(async () => {
    const response = await signUp(VALID_CREDENTIALS);
    expectSignUpSuccess(response);

    await verifyAccount(VALID_CREDENTIALS);

    const loginResponse = await login(VALID_CREDENTIALS);
    expectLoginSuccess(loginResponse);
    authorizationHeader = `Bearer ${loginResponse.header['authorization']}`;
  });

  it('should create a new role permission', async () => {
    const { body: roleBody } = await createRoleRequest(VALID_ROLE, authorizationHeader);
    const { body: permissionBody } = await supertest(app).post('/api/v1/permissions').send(VALID_PERMISSION);

    const rolePermission = {
      roleId: roleBody.role.id,
      permissionId: permissionBody.permission.id,
    };

    const { body } = await supertest(app).post('/api/v1/role-permissions').send(rolePermission);

    expect(body).toMatchObject({
      message: success.ROLE_PERMISSION_CREATED_SUCCESSFULLY,
      rolePermission: {
        roleId: rolePermission.roleId,
        permissionId: rolePermission.permissionId,
      },
    });
  });
});
