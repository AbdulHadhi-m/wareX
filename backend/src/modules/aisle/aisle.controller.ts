import { Request, Response } from 'express';
import { AisleService } from './aisle.service';
import { asyncHandler } from '../../shared/middleware/async-handler';
import { sendCreated, sendSuccess, sendNoContent } from '../../shared/utils/api-response';

export class AisleController {
  constructor(private readonly aisleService: AisleService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.aisleService.create(req.body, req.userId!);
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
    const result = await this.aisleService.update(String(req.params.id), req.body, req.userId!);
    sendSuccess(res, result);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.aisleService.delete(String(req.params.id), req.userId!);
    sendNoContent(res);
  });
}
