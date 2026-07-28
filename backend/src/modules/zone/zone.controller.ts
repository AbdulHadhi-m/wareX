import { Request, Response } from 'express';
import { ZoneService } from './zone.service';
import { asyncHandler } from '../../shared/middleware/async-handler';
import { sendCreated, sendSuccess, sendNoContent } from '../../shared/utils/api-response';

export class ZoneController {
  constructor(private readonly zoneService: ZoneService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.zoneService.create(req.body, req.userId!);
    sendCreated(res, result);
  });

  findAll = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this.zoneService.findAll();
    sendSuccess(res, result);
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
    const result = await this.zoneService.update(String(req.params.id), req.body, req.userId!);
    sendSuccess(res, result);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.zoneService.delete(String(req.params.id), req.userId!);
    sendNoContent(res);
  });
}
