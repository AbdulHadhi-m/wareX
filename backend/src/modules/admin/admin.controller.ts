import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { asyncHandler } from '../../shared/middleware/async-handler';
import { sendSuccess, sendCreated, sendNoContent } from '../../shared/utils/api-response';

export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  list = asyncHandler(async (req: Request, res: Response) => {
    const search = req.query.search ? String(req.query.search) : undefined;
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const sortBy = req.query.sortBy ? String(req.query.sortBy) : undefined;
    const sortOrderParam = String(req.query.sortOrder || '');
    const sortOrder = sortOrderParam === 'asc' || sortOrderParam === 'desc' ? sortOrderParam : undefined;
    const roleId = req.query.roleId ? String(req.query.roleId) : undefined;

    const result = await this.adminService.list({
      search,
      page,
      limit,
      sortBy,
      sortOrder,
      roleId,
    });
    sendSuccess(res, result.data, 200, result.meta);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const user = await this.adminService.getById(id);
    sendSuccess(res, user);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.adminService.create(req.body);
    sendCreated(res, user);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const user = await this.adminService.update(id, req.body);
    sendSuccess(res, user);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await this.adminService.delete(id);
    sendNoContent(res);
  });
}
