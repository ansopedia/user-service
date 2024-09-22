import { Schema, model } from "mongoose";
import { RolePermission } from "./role-permission.validation";
import { ErrorTypeEnum } from "@/constants";

const RolePermissionSchema = new Schema(
  {
    roleId: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    permissionId: {
      type: Schema.Types.ObjectId,
      ref: "Permission",
      required: true,
    },
  },
  { timestamps: true }
);

RolePermissionSchema.index({ roleId: 1, permissionId: 1 }, { unique: true });

RolePermissionSchema.pre("save", async function (next) {
  const roleExists = await model("Role").exists({ _id: this.roleId });
  const permissionExists = await model("Permission").exists({
    _id: { $in: this.permissionId },
  });

  if (!roleExists) throw new Error(ErrorTypeEnum.enum.ROLE_NOT_FOUND);

  if (!permissionExists) throw new Error(ErrorTypeEnum.enum.PERMISSION_NOT_FOUND);

  next();
});

export const RolePermissionModel = model<RolePermission>("RolePermission", RolePermissionSchema);
