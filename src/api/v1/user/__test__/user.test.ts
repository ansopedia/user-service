import { DEFAULT_PAGINATION_LIMIT, ErrorTypeEnum, STATUS_CODES, defaultUsers, errorMap, mockUser } from "@/constants";
import {
  createUser,
  expectFindUserByUsernameSuccess,
  expectLoginSuccess,
  expectUnauthorizedResponseForInvalidAuthorizationHeader,
  expectUnauthorizedResponseForMissingAuthorizationHeader,
  expectUserCreationSuccess,
  expectUserNotFoundError,
  findUserByUsername,
  getAllUsers,
  login,
} from "@/utils/test";

import { success } from "../user.constant.js";

describe("User Test", () => {
  let authorizationHeader: string;
  beforeAll(async () => {
    const loginResponse = await login(defaultUsers);
    expectLoginSuccess(loginResponse);
    authorizationHeader = `Bearer ${loginResponse.header["authorization"]}`;
  });

  it("should return 401 for missing authorization header", async () => {
    const response = await createUser(mockUser, "");
    expectUnauthorizedResponseForMissingAuthorizationHeader(response);
  });

  it("should return 401 for invalid authorization header", async () => {
    const response = await createUser(mockUser, "invalid");
    expectUnauthorizedResponseForInvalidAuthorizationHeader(response);
  });

  // it("should not create a new user without create-user permission", async () => {
  //   const unAuthorizedUser = { ...mockUser, username: "unauthorized", email: "unauthorized@gmail.com" };

  //   const response = await createUser(unAuthorizedUser, authorizationHeader);
  //   expectUserCreationSuccess(response, unAuthorizedUser);

  //   await verifyAccount(unAuthorizedUser);

  //   const loginResponse = await login(unAuthorizedUser);
  //   expectLoginSuccess(loginResponse);
  //   const header = `Bearer ${loginResponse.header["authorization"]}`;

  //   const mockUserRes = await createUser(mockUser, header);
  //   expectUnauthorizedResponseWhenUserHasInsufficientPermission(mockUserRes);
  // });

  it("should create a new user with valid credentials", async () => {
    const response = await createUser(mockUser, authorizationHeader);
    expectUserCreationSuccess(response, mockUser);
  });

  it("should respond with 409 for duplicate email", async () => {
    const errorObject = errorMap[ErrorTypeEnum.enum.EMAIL_ALREADY_EXISTS];
    const response = await createUser(mockUser, authorizationHeader);
    expect(response.statusCode).toBe(STATUS_CODES.CONFLICT);
    expect(response.body.message).toBe(errorObject.body.message);
    expect(response.body.code).toBe(errorObject.body.code);
  });

  it("should respond with 409 for duplicate username", async () => {
    const errorObject = errorMap[ErrorTypeEnum.enum.USER_NAME_ALREADY_EXISTS];
    const response = await createUser({ ...mockUser, email: "new@gmail.com" }, authorizationHeader);
    expect(response.statusCode).toBe(STATUS_CODES.CONFLICT);
    expect(response.body.message).toBe(errorObject.body.message);
    expect(response.body.code).toBe(errorObject.body.code);
  });

  it("should return 401 when finding a user by username without an authorization header", async () => {
    const response = await findUserByUsername(mockUser.username, "");
    expectUnauthorizedResponseForMissingAuthorizationHeader(response);
  });

  it("should return 401 when getting all users without an authorization header", async () => {
    const response = await getAllUsers({ limit: DEFAULT_PAGINATION_LIMIT, offset: 0 }, "");
    expectUnauthorizedResponseForMissingAuthorizationHeader(response);
  });

  it("logged in user should find user by username", async () => {
    const response = await findUserByUsername(mockUser.username, authorizationHeader);
    expectFindUserByUsernameSuccess(response, mockUser);
  });

  it("logged in should respond with 404 for user not found", async () => {
    const response = await findUserByUsername("invalidUsername", authorizationHeader);
    expectUserNotFoundError(response);
  });

  it("should fetch all users", async () => {
    const limit = DEFAULT_PAGINATION_LIMIT;
    const response = await getAllUsers({ limit, offset: 0 }, authorizationHeader);

    const { statusCode, body } = response;

    expect(statusCode).toBe(STATUS_CODES.OK);

    expect(body).toMatchObject({
      message: success.USER_FETCHED_SUCCESSFULLY,
      data: {
        totalUsers: expect.any(Number),
        users: expect.any(Array),
      },
    });

    if (body.data.users.length > 0) {
      expect(body.data.users.length).toBeLessThanOrEqual(limit);
      expect(body.data.users[0]).not.toHaveProperty("password");
      expect(body.data.users[0]).not.toHaveProperty("confirmPassword");
    }
  });
});
