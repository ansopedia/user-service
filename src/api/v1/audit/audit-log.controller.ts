import type { ObjectId } from "@ansospace/types";
import type { Request, Response } from "express";
import { z } from "zod";

import type { Permission } from "@/constants";
import { STATUS_CODES } from "@/constants";
import { sendResponse } from "@/utils";

import { AuditLogService } from "./audit-log.service.js";

// Schema for audit log query parameters
const auditLogQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
  userId: z.string().optional(),
  action: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export class AuditLogController {
  public static async getAuditLogs(req: Request, res: Response) {
    const { userId, permissions } = res.locals.loggedInUser;

    // Validate query parameters
    const query = auditLogQuerySchema.parse(req.query);

    const { logs, total } = await AuditLogService.getAuditLogs(
      userId,
      permissions as unknown as Permission[],
      {
        userId: query.userId as unknown as ObjectId,
        action: query.action,
        startDate: query.startDate,
        endDate: query.endDate,
      },
      {
        limit: query.limit,
        offset: query.offset,
      }
    );

    sendResponse({
      response: res,
      message: "Audit logs fetched successfully",
      statusCode: STATUS_CODES.OK,
      data: {
        logs,
        pagination: {
          total,
          limit: query.limit,
          offset: query.offset,
        },
      },
    });
  }
}
