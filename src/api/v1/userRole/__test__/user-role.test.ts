import { createRole } from "@/api/v1/role/role.validation";
import { defaultUsers } from "@/constants";
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
  createdBy: "65f6dac9156e93e7b6f1b88d",
  isSystemRole: false,
  isDeleted: false,
};

describe("User Role Test", () => {
  let authorizationHeader: string;
  let loggedInUserId: string;

  beforeAll(async () => {
    const loginResponse = await login(defaultUsers);
    expectLoginSuccess(loginResponse);
    loggedInUserId = loginResponse.body.userId;
    authorizationHeader = `Bearer ${loginResponse.header["authorization"]}`;
  });

  it("should create a new role permission", async () => {
    const response = await createRoleRequest(VALID_ROLE, authorizationHeader);
    expectCreateRoleSuccess(response, VALID_ROLE);

    const userRole = {
      roleId: response.body.role.id,
      userId: loggedInUserId,
    };

    const createUserRoleResponse = await createUserRoleRequest(userRole, authorizationHeader);
    expectCreateUserRoleSuccess(createUserRoleResponse, userRole);
  });
});
