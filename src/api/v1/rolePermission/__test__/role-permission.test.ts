import request from 'supertest';
import { app } from '../../../../server';
import { success } from '../role-permission.constant';

const VALID_ROLE = {
  name: 'new-role',
  description: 'this is super admin creating first time',
  createdBy: '65f6dac9156e93e7b6f1b88d',
};

const VALID_PERMISSION = {
  name: 'new-permissions',
  description: 'this is crete permission creating first time',
  createdBy: '65f6dac9156e93e7b6f1b88d',
};

describe('Role Permission Test', () => {
  it('should create a new role permission', async () => {
    const { body: roleBody } = await request(app).post('/api/v1/roles').send(VALID_ROLE);
    const { body: permissionBody } = await request(app).post('/api/v1/permissions').send(VALID_PERMISSION);

    const rolePermission = {
      roleId: roleBody.role.id,
      permissionId: permissionBody.permission.id,
    };

    const { body } = await request(app).post('/api/v1/role-permissions').send(rolePermission);

    expect(body).toMatchObject({
      message: success.ROLE_PERMISSION_CREATED_SUCCESSFULLY,
      rolePermission: {
        roleId: rolePermission.roleId,
        permissionId: rolePermission.permissionId,
      },
    });
  });
});
