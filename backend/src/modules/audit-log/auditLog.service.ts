import { AuditLogRepository } from './auditLog.repository';
import {
  AuditLogCreateDTO,
  AuditLogResponse,
  AuditLogSearchParams,
  IAuditLog,
} from './auditLog.types';
import { NotFoundError } from '../../shared/errors/not-found-error';
import { parsePagination, buildPaginationMeta } from '../../shared/utils/pagination';
import { type PaginationMeta } from '../../shared/types/api-response';
import { UserModel } from '../auth/auth.model';

export class AuditLogService {
  constructor(
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  async log(dto: AuditLogCreateDTO): Promise<void> {
    try {
      const user = await UserModel.findById(dto.userId).select('name').lean();

      await this.auditLogRepository.create({
        userId: dto.userId,
        userName: user?.name || null,
        userRole: dto.userRole,
        module: dto.module,
        action: dto.action,
        resourceType: dto.resourceType,
        resourceId: dto.resourceId ?? null,
        previousData: dto.previousData ?? null,
        newData: dto.newData ?? null,
        ipAddress: dto.ipAddress ?? null,
        userAgent: dto.userAgent ?? null,
      });
    } catch {
      // Audit logging must never fail the original operation
    }
  }

  async search(
    params: AuditLogSearchParams,
  ): Promise<{ data: AuditLogResponse[]; meta: PaginationMeta }> {
    const filter = this.auditLogRepository.buildFilter(params);
    const pagination = parsePagination({ page: params.page, limit: params.limit });

    const sort: Record<string, 1 | -1> = {
      [params.sortBy]: params.sortOrder === 'asc' ? 1 : -1,
    };

    const [logs, total] = await Promise.all([
      this.auditLogRepository.search(filter, pagination.skip, pagination.limit, sort),
      this.auditLogRepository.count(filter),
    ]);

    return {
      data: logs.map((l) => this.toAuditLogResponse(l)),
      meta: buildPaginationMeta(total, pagination),
    };
  }

  async findById(id: string): Promise<AuditLogResponse> {
    const log = await this.auditLogRepository.findById(id);

    if (!log) {
      throw new NotFoundError('Audit log not found');
    }

    return this.toAuditLogResponse(log);
  }

  private toAuditLogResponse(log: IAuditLog): AuditLogResponse {
    return {
      id: log._id.toString(),
      userId: log.userId,
      userName: log.userName,
      userRole: log.userRole,
      module: log.module,
      action: log.action,
      resourceType: log.resourceType,
      resourceId: log.resourceId || undefined,
      previousData: log.previousData || undefined,
      newData: log.newData || undefined,
      ipAddress: log.ipAddress || undefined,
      userAgent: log.userAgent || undefined,
      createdAt: new Date(log.createdAt).toISOString(),
    };
  }
}

export const auditService = new AuditLogService(new AuditLogRepository());
