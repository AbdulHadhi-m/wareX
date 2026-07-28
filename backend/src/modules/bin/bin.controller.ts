import { Request, Response } from 'express';
import { BinService } from './bin.service';
import { asyncHandler } from '../../shared/middleware/async-handler';
import { sendCreated, sendSuccess, sendNoContent } from '../../shared/utils/api-response';

export class BinController {
  constructor(private readonly binService: BinService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.binService.create(req.body, req.userId!);
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
    const result = await this.binService.update(String(req.params.id), req.body, req.userId!);
    sendSuccess(res, result);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.binService.delete(String(req.params.id), req.userId!);
    sendNoContent(res);
  });
}
