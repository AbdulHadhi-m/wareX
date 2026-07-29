import { Request, Response } from 'express';
import { RoleService } from './role.service';
import { asyncHandler } from '../../shared/middleware/async-handler';
import { sendSuccess, sendCreated, sendNoContent } from '../../shared/utils/api-response';

export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  findAll = asyncHandler(async (_req: Request, res: Response) => {
    const roles = await this.roleService.findAll();
    sendSuccess(res, roles);
  });

  findById = asyncHandler(async (req: Request, res: Response) => {
    const role = await this.roleService.findById(String(req.params.id));
    sendSuccess(res, role);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const role = await this.roleService.create(req.body);
    sendCreated(res, role);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const role = await this.roleService.update(String(req.params.id), req.body);
    sendSuccess(res, role);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.roleService.delete(String(req.params.id));
    sendNoContent(res);
  });
}
