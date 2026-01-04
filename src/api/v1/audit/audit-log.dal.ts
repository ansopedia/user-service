import type { ObjectId } from "@ansospace/types";
import mongoose from "mongoose";

import AuditLogModel, { type IAuditLog } from "./audit-log.model.js";

export interface AuditLogFilter {
  userId?: ObjectId;
  action?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface PaginationOptions {
  limit: number;
  offset: number;
}

export interface IAuditLogDal {
  insertAuditLog(logData: Partial<IAuditLog>): Promise<IAuditLog>;
  getAuditLogs(filter: AuditLogFilter, pagination: PaginationOptions): Promise<{ logs: IAuditLog[]; total: number }>;
}

export class AuditLogDAL implements IAuditLogDal {
  async insertAuditLog(logData: Partial<IAuditLog>): Promise<IAuditLog> {
    const log = new AuditLogModel(logData);
    return await log.save();
  }

  async getAuditLogs(
    filter: AuditLogFilter,
    pagination: PaginationOptions
  ): Promise<{ logs: IAuditLog[]; total: number }> {
    const query: mongoose.QueryFilter<IAuditLog> = {};

    if (filter.userId) {
      query.userId = filter.userId;
    }

    if (filter.action != null && filter.action !== "") {
      query.action = filter.action;
    }

    if (filter.startDate || filter.endDate) {
      const createdAt: Record<string, Date> = {};
      if (filter.startDate) createdAt.$gte = filter.startDate;
      if (filter.endDate) createdAt.$lte = filter.endDate;
      query.createdAt = createdAt;
    }

    const [logs, total] = await Promise.all([
      AuditLogModel.find(query).sort({ createdAt: -1 }).skip(pagination.offset).limit(pagination.limit).exec(),
      AuditLogModel.countDocuments(query),
    ]);

    return { logs, total };
  }
}
