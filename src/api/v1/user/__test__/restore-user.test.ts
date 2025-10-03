import { type GetUser } from "@ansospace/types";
import mongoose from "mongoose";

import { defaultUsers, mockUser } from "@/constants";
import {
  createUser,
  expectBadRequestResponseForValidationError,
  expectFindUserByUsernameSuccess,
  expectLoginSuccess,
  expectRestoreUserSuccess,
  expectUnauthorizedResponseForInvalidAuthorizationHeader,
  expectUnauthorizedResponseForMissingAuthorizationHeader,
  expectUserCreationSuccess,
  expectUserNotFoundError,
  findUserByUsername,
  login,
  restoreUser,
} from "@/utils/test";

describe("Restore User", () => {
  let authorizationHeader: string;
  let userToDelete: GetUser;

  beforeAll(async () => {
    const loginResponse = await login(defaultUsers);
    expectLoginSuccess(loginResponse);
    authorizationHeader = `Bearer ${loginResponse.header["authorization"]}`;

    const userResponse = await createUser(mockUser, authorizationHeader);
    expectUserCreationSuccess(userResponse, mockUser);

    const foundUserRes = await findUserByUsername(mockUser.username, authorizationHeader);
    expectFindUserByUsernameSuccess(foundUserRes, mockUser);

    userToDelete = foundUserRes.body.data;
  });

  it("should return 401 for missing authorization header", async () => {
    const response = await restoreUser(userToDelete.id, "");
    expectUnauthorizedResponseForMissingAuthorizationHeader(response);
  });

  it("should return 401 for invalid authorization header", async () => {
    const response = await restoreUser(userToDelete.id, "invalid");
    expectUnauthorizedResponseForInvalidAuthorizationHeader(response);
  });

  it("should return 400 for invalid user id", async () => {
    const response = await restoreUser("invalid", authorizationHeader);
    expectBadRequestResponseForValidationError(response);
  });

  it("should return 404 for user not found", async () => {
    const response = await restoreUser(new mongoose.Types.ObjectId(), authorizationHeader);
    expectUserNotFoundError(response);
  });

  // it("should return 403 for unauthorized user", async () => {
  //   const unAuthorizedUser = {
  //     ...mockUser,
  //     username: "unauthorized",
  //     email: "unauthorized@gmail.com",
  //   };

  //   const createUserRes = await createUser(unAuthorizedUser, authorizationHeader);
  //   expectUserCreationSuccess(createUserRes, unAuthorizedUser);

  //   await verifyAccount(unAuthorizedUser);

  //   const loginResponse = await login(unAuthorizedUser);
  //   expectLoginSuccess(loginResponse);
  //   const header = `Bearer ${loginResponse.header["authorization"]}`;

  //   const restoreUserRes = await restoreUser(userToDelete.id, header);
  //   expectUnauthorizedResponseWhenUserHasInsufficientPermission(restoreUserRes);
  // });

  it("should soft delete user", async () => {
    const response = await restoreUser(userToDelete.id, authorizationHeader);
    expectRestoreUserSuccess(response);
  });
});
