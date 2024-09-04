import supertest from 'supertest';
import { app } from '@/server';
import { success } from '../role.constant';
import { ErrorTypeEnum, STATUS_CODES, errorMap } from '@/constants';

const VALID_ROLE = {
  name: 'new-role',
  description: 'this is new-role creating first time',
  createdBy: '65f6dac9156e93e7b6f1b88d',
};

const testInvalidField = async (field: string, value: string) => {
  const errorObj = errorMap[ErrorTypeEnum.enum.VALIDATION_ERROR];

  const response = await supertest(app)
    .post('/api/v1/roles')
    .send({
      ...VALID_ROLE,
      [field]: value,
    });

  expect(response.statusCode).toBe(STATUS_CODES.BAD_REQUEST);
  expect(response.body.message).toBe(errorObj.body.message);
  expect(response.body.code).toBe(errorObj.body.code);
};

describe('Role Service', () => {
  it('should create a new role', async () => {
    const response = await supertest(app).post('/api/v1/roles').send(VALID_ROLE);
    expect(response).toBeDefined();

    const { statusCode, body } = response;

    expect(statusCode).toBe(STATUS_CODES.CREATED);

    expect(body).toMatchObject({
      message: success.ROLE_CREATED_SUCCESSFULLY,
      role: {
        id: expect.any(String),
        name: VALID_ROLE.name,
        description: VALID_ROLE.description,
      },
    });
  });

  it('should respond with 409 for duplicate role', async () => {
    const errorObject = errorMap[ErrorTypeEnum.enum.ROLE_ALREADY_EXISTS];
    const response = await supertest(app).post('/api/v1/roles').send(VALID_ROLE);

    expect(response.statusCode).toBe(STATUS_CODES.CONFLICT);
    expect(response.body.message).toBe(errorObject.body.message);
    expect(response.body.code).toBe(errorObject.body.code);
  });

  it('should respond with 400 for invalid role name', async () => {
    await testInvalidField('name', 'a');
  });

  it('should respond with 400 for invalid role description', async () => {
    await testInvalidField('description', 'a');
  });

  it('should respond with 400 for invalid createdBy', async () => {
    await testInvalidField('createdBy', 'a');
  });

  it('should get all roles', async () => {
    const response = await supertest(app).get('/api/v1/roles');
    expect(response).toBeDefined();

    const { statusCode, body } = response;

    expect(statusCode).toBe(STATUS_CODES.OK);
    expect(body).toMatchObject({
      message: success.ROLES_FETCHED_SUCCESSFULLY,
      roles: expect.any(Array),
    });
  });
});
