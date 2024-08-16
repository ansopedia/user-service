import request from 'supertest';
import { app } from '@/server';
import { ErrorTypeEnum, STATUS_CODES, errorMap } from '@/constants';
import { success } from '../permission.constant';
import { createPermission, PermissionCategory } from '../permission.validation';

const VALID_PERMISSION: createPermission = {
  name: 'create-permission',
  description: 'this is crete permission creating first time',
  category: PermissionCategory.SYSTEM,
  isDeleted: false,
  createdBy: '65f6dac9156e93e7b6f1b88d',
};

const testInvalidField = async (field: string, value: string) => {
  const errorObj = errorMap[ErrorTypeEnum.enum.VALIDATION_ERROR];

  const response = await request(app)
    .post('/api/v1/permissions')
    .send({
      ...VALID_PERMISSION,
      [field]: value,
    });

  expect(response.statusCode).toBe(STATUS_CODES.BAD_REQUEST);
  expect(response.body.message).toBe(errorObj.body.message);
  expect(response.body.code).toBe(errorObj.body.code);
};

describe('Permission Service', () => {
  it('should create a new permission', async () => {
    const response = await request(app).post('/api/v1/permissions').send(VALID_PERMISSION);
    expect(response).toBeDefined();

    const { statusCode, body } = response;

    expect(statusCode).toBe(STATUS_CODES.CREATED);

    expect(body).toMatchObject({
      message: success.PERMISSION_CREATED_SUCCESSFULLY,
      permission: {
        id: expect.any(String),
        name: VALID_PERMISSION.name,
        description: VALID_PERMISSION.description,
        category: VALID_PERMISSION.category,
      },
    });
  });

  it('should respond with 409 for duplicate permission', async () => {
    const errorObject = errorMap[ErrorTypeEnum.enum.PERMISSION_ALREADY_EXISTS];
    const response = await request(app).post('/api/v1/permissions').send(VALID_PERMISSION);

    expect(response.statusCode).toBe(STATUS_CODES.CONFLICT);
    expect(response.body.message).toBe(errorObject.body.message);
    expect(response.body.code).toBe(errorObject.body.code);
  });

  it('should respond with 400 for invalid permission name', async () => {
    await testInvalidField('name', 'a');
  });

  it('should respond with 400 for invalid permission description', async () => {
    await testInvalidField('description', 'a');
  });

  it('should respond with 400 for invalid createdBy', async () => {
    await testInvalidField('createdBy', 'a');
  });

  it('should get all permissions', async () => {
    const response = await request(app).get('/api/v1/permissions');

    expect(response).toBeDefined();

    const { statusCode, body } = response;

    expect(statusCode).toBe(STATUS_CODES.OK);
    expect(body).toMatchObject({
      message: success.PERMISSION_FETCHED_SUCCESSFULLY,
      permissions: expect.any(Array),
    });
  });
});
