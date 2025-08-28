import mongoose from "mongoose";

import { type createRole } from "@/api/v1/role/role.validation.js";
import { defaultUsers } from "@/constants";
import { type MongooseObjectId } from "@/types";
import {
  createRoleRequest,
  createUserRoleRequest,
  expectCreateRoleSuccess,
  expectCreateUserRoleSuccess,
  expectLoginSuccess,
  login,
} from "@/utils/test";

const VALID_ROLE: createRole = {
  name: "new-role",
  description: "this is super admin creating first time",
  createdBy: new mongoose.Types.ObjectId(),
  isSystemRole: false,
  isDeleted: false,
};

describe("User Role Test", () => {
  let authorizationHeader: string;
  let loggedInUserId: MongooseObjectId;

  beforeAll(async () => {
    const loginResponse = await login(defaultUsers);
    expectLoginSuccess(loginResponse);
    loggedInUserId = loginResponse.body.data.userId;
    authorizationHeader = `Bearer ${loginResponse.header["authorization"]}`;
  });

  it("should create a new role permission", async () => {
    const response = await createRoleRequest(VALID_ROLE, authorizationHeader);
    expectCreateRoleSuccess(response, VALID_ROLE);

    const userRole = {
      roleId: response.body.data.role.id,
      userId: loggedInUserId,
    };

    const createUserRoleResponse = await createUserRoleRequest(userRole, authorizationHeader);
    expectCreateUserRoleSuccess(createUserRoleResponse, userRole);
  });
});
