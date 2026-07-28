import { AuditLogModel } from './auditLog.model';
import { IAuditLog, AuditLogSearchParams } from './auditLog.types';

export class AuditLogRepository {
  async create(data: Record<string, unknown>): Promise<IAuditLog> {
    const doc = await AuditLogModel.create(data);
    return doc.toObject();
  }

  async findById(id: string): Promise<IAuditLog | null> {
    return AuditLogModel.findById(id).lean();
  }

  async search(
    filter: Record<string, unknown>,
    skip: number,
    limit: number,
    sort: Record<string, 1 | -1>,
  ): Promise<IAuditLog[]> {
    return AuditLogModel.find(filter as any)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async count(filter: Record<string, unknown>): Promise<number> {
    return AuditLogModel.countDocuments(filter as any);
  }

  buildFilter(params: AuditLogSearchParams): Record<string, unknown> {
    const filter: Record<string, unknown> = {};

    if (params.userId) {
      filter.userId = params.userId;
    }

    if (params.module) {
      filter.module = params.module;
    }

    if (params.action) {
      filter.action = params.action;
    }

    if (params.resourceType) {
      filter.resourceType = params.resourceType;
    }

    if (params.startDate || params.endDate) {
      const createdAt: Record<string, unknown> = {};

      if (params.startDate) {
        createdAt.$gte = new Date(params.startDate);
      }

      if (params.endDate) {
        createdAt.$lte = new Date(params.endDate);
      }

      filter.createdAt = createdAt;
    }

    return filter;
  }
}
