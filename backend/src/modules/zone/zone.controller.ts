import { Request, Response } from 'express';
import { ZoneService } from './zone.service';
import { asyncHandler } from '../../shared/middleware/async-handler';
import { sendCreated, sendSuccess, sendNoContent } from '../../shared/utils/api-response';
import { auditService } from '../audit-log/auditLog.service';

export class ZoneController {
  constructor(private readonly zoneService: ZoneService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.zoneService.create(req.body, req.userId!);

    auditService.log({
      userId: req.userId!,
      userRole: req.userRole!,
      module: 'Zone',
      action: 'Create',
      resourceType: 'Zone',
      resourceId: result.id,
      newData: result,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string | undefined,
    });

    sendCreated(res, result);
  });

  findAll = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.zoneService.search(req.query as Record<string, unknown>);
    sendSuccess(res, result.data, 200, result.meta);
  });

  findById = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.zoneService.findById(String(req.params.id));
    sendSuccess(res, result);
  });

  findByWarehouse = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.zoneService.findByWarehouseId(String(req.params.warehouseId));
    sendSuccess(res, result);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const oldData = await this.zoneService.findById(String(req.params.id));
    const result = await this.zoneService.update(String(req.params.id), req.body, req.userId!);

    auditService.log({
      userId: req.userId!,
      userRole: req.userRole!,
      module: 'Zone',
      action: 'Update',
      resourceType: 'Zone',
      resourceId: result.id,
      previousData: oldData,
      newData: result,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string | undefined,
    });

    sendSuccess(res, result);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const oldData = await this.zoneService.findById(String(req.params.id));
    await this.zoneService.delete(String(req.params.id), req.userId!);

    auditService.log({
      userId: req.userId!,
      userRole: req.userRole!,
      module: 'Zone',
      action: 'Delete',
      resourceType: 'Zone',
      resourceId: String(req.params.id),
      previousData: oldData,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string | undefined,
    });

    sendNoContent(res);
  });
}
