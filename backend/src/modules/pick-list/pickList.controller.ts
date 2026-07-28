import { Request, Response } from 'express';
import { PickListService } from './pickList.service';
import { asyncHandler } from '../../shared/middleware/async-handler';
import { sendCreated, sendSuccess } from '../../shared/utils/api-response';
import { parsePagination } from '../../shared/utils/pagination';
import { PickListStatus } from './pickList.types';

export class PickListController {
  constructor(private readonly pickListService: PickListService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.pickListService.create(req.body, req.userId!);
    sendCreated(res, result);
  });

  findAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);

    const result = await this.pickListService.search(
      {
        status: req.query.status as PickListStatus | undefined,
        workerId: req.query.workerId as string | undefined,
        startDate: req.query.startDate as string | undefined,
        endDate: req.query.endDate as string | undefined,
        page,
        limit,
        sortBy: (req.query.sortBy as string) || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
      },
      req.userRole,
      req.userId,
    );

    sendSuccess(res, result.data, 200, result.meta);
  });

  findById = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.pickListService.findById(String(req.params.id));
    sendSuccess(res, result);
  });

  getByWorker = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);
    const result = await this.pickListService.getByWorker(
      String(req.params.workerId),
      { page, limit },
    );
    sendSuccess(res, result.data, 200, result.meta);
  });

  assign = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.pickListService.assign(
      String(req.params.id),
      req.body,
      req.userId!,
    );
    sendSuccess(res, result);
  });

  start = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.pickListService.start(
      String(req.params.id),
      req.userId!,
    );
    sendSuccess(res, result);
  });

  complete = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.pickListService.complete(
      String(req.params.id),
      req.userId!,
    );
    sendSuccess(res, result);
  });

  cancel = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.pickListService.cancel(
      String(req.params.id),
      req.userId!,
    );
    sendSuccess(res, result);
  });
}
