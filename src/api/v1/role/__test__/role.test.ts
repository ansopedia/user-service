import { ErrorTypeEnum, STATUS_CODES, errorMap } from '@/constants';
import {
  expectLoginSuccess,
  expectSignUpSuccess,
  login,
  signUp,
  verifyAccount,
  createRoleRequest,
  expectCreateRoleSuccess,
  expectGetRolesSuccess,
  getRoles,
} from '@/utils/test';
import { createRole } from '../role.validation';

const VALID_ROLE: createRole = {
  name: 'new-role',
  description: 'this is new-role creating first time',
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

const testInvalidField = async (field: string, value: string, authorizationHeader: string) => {
  const errorObj = errorMap[ErrorTypeEnum.enum.VALIDATION_ERROR];

  const response = await createRoleRequest(
    {
      ...VALID_ROLE,
      [field]: value,
    },
    authorizationHeader,
  );

  expect(response.statusCode).toBe(STATUS_CODES.BAD_REQUEST);
  expect(response.body.message).toBe(errorObj.body.message);
  expect(response.body.code).toBe(errorObj.body.code);
};

describe('Role Service', () => {
  let authorizationHeader: string;
  beforeAll(async () => {
    const response = await signUp(VALID_CREDENTIALS);
    expectSignUpSuccess(response);

    await verifyAccount(VALID_CREDENTIALS);

    const loginResponse = await login(VALID_CREDENTIALS);
    expectLoginSuccess(loginResponse);
    authorizationHeader = `Bearer ${loginResponse.header['authorization']}`;
  });

  it('should create a new role', async () => {
    const response = await createRoleRequest(VALID_ROLE, authorizationHeader);
    expectCreateRoleSuccess(response, VALID_ROLE);
  });

  it('should respond with 409 for duplicate role', async () => {
    const errorObject = errorMap[ErrorTypeEnum.enum.ROLE_ALREADY_EXISTS];
    const response = await createRoleRequest(VALID_ROLE, authorizationHeader);

    expect(response.statusCode).toBe(STATUS_CODES.CONFLICT);
    expect(response.body.message).toBe(errorObject.body.message);
    expect(response.body.code).toBe(errorObject.body.code);
  });

  it('should respond with 400 for invalid role name', async () => {
    await testInvalidField('name', 'a', authorizationHeader);
  });

  it('should respond with 400 for invalid role description', async () => {
    await testInvalidField('description', 'a', authorizationHeader);
  });

  it('should respond with 400 for invalid createdBy', async () => {
    await testInvalidField('createdBy', 'a', authorizationHeader);
  });

  it('should get all roles', async () => {
    const response = await getRoles();
    expectGetRolesSuccess(response);
  });
});
