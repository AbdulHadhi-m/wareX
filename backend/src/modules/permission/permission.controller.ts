import { Request, Response } from 'express';
import { PermissionService } from './permission.service';
import { asyncHandler } from '../../shared/middleware/async-handler';
import { sendSuccess, sendCreated, sendNoContent } from '../../shared/utils/api-response';

export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  findAll = asyncHandler(async (_req: Request, res: Response) => {
    const permissions = await this.permissionService.findAll();
    sendSuccess(res, permissions);
  });

  findByModule = asyncHandler(async (req: Request, res: Response) => {
    const permissions = await this.permissionService.findByModule(String(req.params.module));
    sendSuccess(res, permissions);
  });

  findById = asyncHandler(async (req: Request, res: Response) => {
    const permission = await this.permissionService.findById(String(req.params.id));
    sendSuccess(res, permission);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const permission = await this.permissionService.create(req.body);
    sendCreated(res, permission);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const permission = await this.permissionService.update(String(req.params.id), req.body);
    sendSuccess(res, permission);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.permissionService.delete(String(req.params.id));
    sendNoContent(res);
  });
}
