import { Request, Response } from 'express';
import { DeviceService } from './device.service';
import { asyncHandler } from '../../shared/middleware/async-handler';
import { sendCreated, sendSuccess, sendNoContent } from '../../shared/utils/api-response';
import { parsePagination } from '../../shared/utils/pagination';
import { DeviceStatus, DeviceCondition } from './device.types';

export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.deviceService.create(req.body, req.userId!);
    sendCreated(res, result);
  });

  findAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);

    const result = await this.deviceService.search({
      deviceName: req.query.deviceName as string | undefined,
      brand: req.query.brand as string | undefined,
      model: req.query.model as string | undefined,
      category: req.query.category as string | undefined,
      status: req.query.status as DeviceStatus | undefined,
      condition: req.query.condition as DeviceCondition | undefined,
      binId: req.query.binId as string | undefined,
      aisleId: req.query.aisleId as string | undefined,
      zoneId: req.query.zoneId as string | undefined,
      warehouseId: req.query.warehouseId as string | undefined,
      page,
      limit,
      sortBy: (req.query.sortBy as string) || 'createdAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    });

    sendSuccess(res, result.data, 200, result.meta);
  });

  findById = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.deviceService.findById(String(req.params.id));
    sendSuccess(res, result);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.deviceService.update(String(req.params.id), req.body, req.userId!);
    sendSuccess(res, result);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.deviceService.delete(String(req.params.id), req.userId!);
    sendNoContent(res);
  });
}
