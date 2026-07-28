import { Request, Response } from 'express';
import { AuditLogService } from './auditLog.service';
import { asyncHandler } from '../../shared/middleware/async-handler';
import { sendSuccess } from '../../shared/utils/api-response';
import { parsePagination } from '../../shared/utils/pagination';

export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  findAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);

    const result = await this.auditLogService.search({
      userId: req.query.userId as string | undefined,
      module: req.query.module as string | undefined,
      action: req.query.action as string | undefined,
      resourceType: req.query.resourceType as string | undefined,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      page,
      limit,
      sortBy: (req.query.sortBy as string) || 'createdAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    });

    sendSuccess(res, result.data, 200, result.meta);
  });

  findById = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.auditLogService.findById(String(req.params.id));
    sendSuccess(res, result);
  });
}
