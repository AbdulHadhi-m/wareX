import { Request, Response } from 'express';
import { DeviceService } from './device.service';
import { asyncHandler } from '../../shared/middleware/async-handler';
import { sendCreated, sendSuccess, sendNoContent } from '../../shared/utils/api-response';
import { auditService } from '../audit-log/auditLog.service';

export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.deviceService.create(req.body, req.userId!);

    auditService.log({
      userId: req.userId!,
      userRole: req.userRole!,
      module: 'Device',
      action: 'Register',
      resourceType: 'Device',
      resourceId: result.id,
      newData: result,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string | undefined,
    });

    sendCreated(res, result);
  });

  findAll = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.deviceService.search(req.query as Record<string, unknown>);
    sendSuccess(res, result.data, 200, result.meta);
  });

  findById = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.deviceService.findById(String(req.params.id));
    sendSuccess(res, result);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const oldData = await this.deviceService.findById(String(req.params.id));
    const result = await this.deviceService.update(String(req.params.id), req.body, req.userId!);

    auditService.log({
      userId: req.userId!,
      userRole: req.userRole!,
      module: 'Device',
      action: 'Update',
      resourceType: 'Device',
      resourceId: result.id,
      previousData: oldData,
      newData: result,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string | undefined,
    });

    sendSuccess(res, result);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const oldData = await this.deviceService.findById(String(req.params.id));
    await this.deviceService.delete(String(req.params.id), req.userId!);

    auditService.log({
      userId: req.userId!,
      userRole: req.userRole!,
      module: 'Device',
      action: 'Delete',
      resourceType: 'Device',
      resourceId: String(req.params.id),
      previousData: oldData,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string | undefined,
    });

    sendNoContent(res);
  });
}
