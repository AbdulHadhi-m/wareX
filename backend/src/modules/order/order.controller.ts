import { Request, Response } from 'express';
import { OrderService } from './order.service';
import { asyncHandler } from '../../shared/middleware/async-handler';
import { sendCreated, sendSuccess } from '../../shared/utils/api-response';
import { parsePagination } from '../../shared/utils/pagination';
import { OrderStatus } from './order.types';

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.orderService.create(req.body, req.userId!);
    sendCreated(res, result);
  });

  findAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);

    const result = await this.orderService.search({
      status: req.query.status as OrderStatus | undefined,
      customerName: req.query.customerName as string | undefined,
      page,
      limit,
      sortBy: (req.query.sortBy as string) || 'createdAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    });

    sendSuccess(res, result.data, 200, result.meta);
  });

  findById = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.orderService.findById(String(req.params.id));
    sendSuccess(res, result);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.orderService.update(String(req.params.id), req.body, req.userId!);
    sendSuccess(res, result);
  });

  cancel = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.orderService.cancel(String(req.params.id), req.userId!);
    sendSuccess(res, result);
  });

  generatePickList = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.orderService.generatePickList(String(req.params.id), req.userId!);
    sendSuccess(res, result);
  });

  fulfill = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.orderService.fulfill(String(req.params.id), req.userId!);
    sendSuccess(res, result);
  });
}
