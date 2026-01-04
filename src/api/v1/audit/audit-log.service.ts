import type { ObjectId } from "@ansospace/types";

import { PERMISSIONS, type Permission } from "@/constants";

import { AuditLogDAL, type AuditLogFilter, type PaginationOptions } from "./audit-log.dal.js";
import type { IAuditLog } from "./audit-log.model.js";

export class AuditLogService {
  private static dal = new AuditLogDAL();

  /**
   * Generic fire-and-forget logging.
   */
  public static async log(
    userId: ObjectId | string,
    action: string,
    details: {
      sessionId?: ObjectId | string;
      ip?: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<void> {
    this.dal
      .insertAuditLog({
        userId: userId as unknown as ObjectId,
        action,
        sessionId: details.sessionId as unknown as ObjectId,
        ip: details.ip,
        metadata: details.metadata,
      })
      .catch((_err) => {
        // We log it internally but don't crash the main flow
      });
  }

  /**
   * RBAC-aware audit log retrieval.
   */
  public static async getAuditLogs(
    requesterId: ObjectId,
    requesterPermissions: Permission[],
    filter: AuditLogFilter,
    pagination: PaginationOptions
  ): Promise<{ logs: IAuditLog[]; total: number }> {
    const isAdmin = requesterPermissions.includes(PERMISSIONS.VIEW_USERS as Permission);

    if (!isAdmin) {
      filter.userId = requesterId;
    }

    return await this.dal.getAuditLogs(filter, pagination);
  }
}
