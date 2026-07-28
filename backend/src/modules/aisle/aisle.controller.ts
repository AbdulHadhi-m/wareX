import { Request, Response } from 'express';
import { AisleService } from './aisle.service';
import { asyncHandler } from '../../shared/middleware/async-handler';
import { sendCreated, sendSuccess, sendNoContent } from '../../shared/utils/api-response';
import { auditService } from '../audit-log/auditLog.service';

export class AisleController {
  constructor(private readonly aisleService: AisleService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.aisleService.create(req.body, req.userId!);

    auditService.log({
      userId: req.userId!,
      userRole: req.userRole!,
      module: 'Aisle',
      action: 'Create',
      resourceType: 'Aisle',
      resourceId: result.id,
      newData: result,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string | undefined,
    });

    sendCreated(res, result);
  });

  findAll = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this.aisleService.findAll();
    sendSuccess(res, result);
  });

  findById = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.aisleService.findById(String(req.params.id));
    sendSuccess(res, result);
  });

  findByZone = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.aisleService.findByZoneId(String(req.params.zoneId));
    sendSuccess(res, result);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const oldData = await this.aisleService.findById(String(req.params.id));
    const result = await this.aisleService.update(String(req.params.id), req.body, req.userId!);

    auditService.log({
      userId: req.userId!,
      userRole: req.userRole!,
      module: 'Aisle',
      action: 'Update',
      resourceType: 'Aisle',
      resourceId: result.id,
      previousData: oldData,
      newData: result,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string | undefined,
    });

    sendSuccess(res, result);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const oldData = await this.aisleService.findById(String(req.params.id));
    await this.aisleService.delete(String(req.params.id), req.userId!);

    auditService.log({
      userId: req.userId!,
      userRole: req.userRole!,
      module: 'Aisle',
      action: 'Delete',
      resourceType: 'Aisle',
      resourceId: String(req.params.id),
      previousData: oldData,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string | undefined,
    });

    sendNoContent(res);
  });
}
