import supertest, { Response } from 'supertest';
import { app } from '@/app';
import { STATUS_CODES } from '@/constants';
import { createPermission } from '@/api/v1/permission/permission.validation';
import { success } from '@/api/v1/permission/permission.constant';

export const createPermissionRequest = async (permission: createPermission): Promise<Response> => {
  return await supertest(app).post('/api/v1/permissions').send(permission);
};

export const expectCreatePermissionSuccess = (response: Response, permission: createPermission): void => {
  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.CREATED);

  expect(body).toMatchObject({
    message: success.PERMISSION_CREATED_SUCCESSFULLY,
    permission: {
      id: expect.any(String),
      name: permission.name,
      description: permission.description,
      category: permission.category,
    },
  });
};

export const getPermissions = async (): Promise<Response> => {
  return await supertest(app).get('/api/v1/permissions');
};

export const expectGetPermissionsSuccess = (response: Response): void => {
  expect(response).toBeDefined();

  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.OK);
  expect(body).toMatchObject({
    message: success.PERMISSION_FETCHED_SUCCESSFULLY,
    permissions: expect.any(Array),
  });
};
