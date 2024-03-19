import request from 'supertest';
import { app } from '../../../../server';
import { STATUS_CODES } from '../../../../constants/statusCode.constant';
import { success } from '../role.constant';
import { ErrorTypeEnum, errorMap } from '../../../../constants/errorTypes.constant';

const VALID_ROLE = {
  name: 'super-admin',
  description: 'this is super admin creating first time',
  createdBy: '65f6dac9156e93e7b6f1b88d',
};

const testInvalidField = async (field: string, value: string) => {
  const errorObj = errorMap[ErrorTypeEnum.enum.VALIDATION_ERROR];

  const response = await request(app)
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
    const response = await request(app).post('/api/v1/roles').send(VALID_ROLE);
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
    const response = await request(app).post('/api/v1/roles').send(VALID_ROLE);

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
});
