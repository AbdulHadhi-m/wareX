import { Request, Response } from 'express';
import { WarehouseService } from './warehouse.service';
import { asyncHandler } from '../../shared/middleware/async-handler';
import { sendCreated, sendSuccess, sendNoContent } from '../../shared/utils/api-response';

export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.warehouseService.create(req.body, req.userId!);
    sendCreated(res, result);
  });

  findAll = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this.warehouseService.findAll();
    sendSuccess(res, result);
  });

  findById = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.warehouseService.findById(String(req.params.id));
    sendSuccess(res, result);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.warehouseService.update(String(req.params.id), req.body, req.userId!);
    sendSuccess(res, result);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.warehouseService.delete(String(req.params.id), req.userId!);
    sendNoContent(res);
  });
}
