import { Request, Response } from 'express';
import { BinService } from './bin.service';
import { asyncHandler } from '../../shared/middleware/async-handler';
import { sendCreated, sendSuccess, sendNoContent } from '../../shared/utils/api-response';
import { auditService } from '../audit-log/auditLog.service';

export class BinController {
  constructor(private readonly binService: BinService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.binService.create(req.body, req.userId!);

    auditService.log({
      userId: req.userId!,
      userRole: req.userRole!,
      module: 'Bin',
      action: 'Create',
      resourceType: 'Bin',
      resourceId: result.id,
      newData: result,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string | undefined,
    });

    sendCreated(res, result);
  });

  findAll = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this.binService.findAll();
    sendSuccess(res, result);
  });

  findById = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.binService.findById(String(req.params.id));
    sendSuccess(res, result);
  });

  findByAisle = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.binService.findByAisleId(String(req.params.aisleId));
    sendSuccess(res, result);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const oldData = await this.binService.findById(String(req.params.id));
    const result = await this.binService.update(String(req.params.id), req.body, req.userId!);

    auditService.log({
      userId: req.userId!,
      userRole: req.userRole!,
      module: 'Bin',
      action: 'Update',
      resourceType: 'Bin',
      resourceId: result.id,
      previousData: oldData,
      newData: result,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string | undefined,
    });

    sendSuccess(res, result);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const oldData = await this.binService.findById(String(req.params.id));
    await this.binService.delete(String(req.params.id), req.userId!);

    auditService.log({
      userId: req.userId!,
      userRole: req.userRole!,
      module: 'Bin',
      action: 'Delete',
      resourceType: 'Bin',
      resourceId: String(req.params.id),
      previousData: oldData,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string | undefined,
    });

    sendNoContent(res);
  });
}
