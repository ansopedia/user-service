import { createRolePermissionBodySchema, createRoleSchema, objectId } from "@ansospace/types";
import type { Request, Response } from "express";

import { STATUS_CODES } from "@/constants";
import { sendResponse } from "@/utils";

import { success } from "./role.constant.js";
import { RoleService } from "./role.service.js";

export class RoleController {
  private roleService: RoleService;

  constructor() {
    this.roleService = new RoleService();
  }

  public createRole = async (req: Request, res: Response): Promise<void> => {
    const parsedInput = createRoleSchema.parse({
      createdBy: res.locals.loggedInUser.userId.toString(),
      ...req.body,
    });

    const role = await this.roleService.createRole(parsedInput);
    sendResponse({
      response: res,
      message: success.ROLE_CREATED_SUCCESSFULLY,
      data: {
        role,
      },
      statusCode: STATUS_CODES.CREATED,
    });
  };

  public getRoles = async (_: Request, res: Response): Promise<void> => {
    const roles = await this.roleService.getRoles();
    sendResponse({
      response: res,
      message: success.ROLES_FETCHED_SUCCESSFULLY,
      data: {
        roles,
      },
      statusCode: STATUS_CODES.OK,
    });
  };

  public createRolePermission = async (req: Request, res: Response): Promise<void> => {
    // TODO: check roleId and all permissionId before inserting into db weather it exists or not.

    const roleId = objectId.parse(req.params.roleId);
    const { permissionIds } = createRolePermissionBodySchema.parse(req.body);

    const createdPermissions = await this.roleService.createRolePermission({ roleId, permissionIds });

    sendResponse({
      response: res,
      message:
        createdPermissions.length > 0 ? success.PERMISSION_ADDED_SUCCESSFULLY : success.PERMISSIONS_ALREADY_EXIST,
      data: {
        createdPermissions,
      },
      statusCode: STATUS_CODES.CREATED,
    });
  };
}
