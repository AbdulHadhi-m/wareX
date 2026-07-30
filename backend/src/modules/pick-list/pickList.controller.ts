import { Request, Response } from 'express';
import { PickListService } from './pickList.service';
import { asyncHandler } from '../../shared/middleware/async-handler';
import { sendCreated, sendSuccess } from '../../shared/utils/api-response';
import { parsePagination } from '../../shared/utils/pagination';
import { auditService } from '../audit-log/auditLog.service';

export class PickListController {
  constructor(private readonly pickListService: PickListService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.pickListService.create(req.body, req.userId!);

    auditService.log({
      userId: req.userId!,
      userRole: req.userRole!,
      module: 'Pick List',
      action: 'Create',
      resourceType: 'PickList',
      resourceId: result.id,
      newData: result,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string | undefined,
    });

    sendCreated(res, result);
  });

  findAll = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.pickListService.search(
      req.query as Record<string, unknown>,
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

  getWorkers = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this.pickListService.getWorkers();
    sendSuccess(res, result);
  });

  assign = asyncHandler(async (req: Request, res: Response) => {
    const oldData = await this.pickListService.findById(String(req.params.id));
    const result = await this.pickListService.assign(
      String(req.params.id),
      req.body,
      req.userId!,
    );

    auditService.log({
      userId: req.userId!,
      userRole: req.userRole!,
      module: 'Pick List',
      action: 'Assign',
      resourceType: 'PickList',
      resourceId: result.id,
      previousData: oldData,
      newData: result,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string | undefined,
    });

    sendSuccess(res, result);
  });

  start = asyncHandler(async (req: Request, res: Response) => {
    const oldData = await this.pickListService.findById(String(req.params.id));
    const result = await this.pickListService.start(
      String(req.params.id),
      req.userId!,
    );

    auditService.log({
      userId: req.userId!,
      userRole: req.userRole!,
      module: 'Pick List',
      action: 'Start',
      resourceType: 'PickList',
      resourceId: result.id,
      previousData: oldData,
      newData: result,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string | undefined,
    });

    sendSuccess(res, result);
  });

  complete = asyncHandler(async (req: Request, res: Response) => {
    const oldData = await this.pickListService.findById(String(req.params.id));
    const result = await this.pickListService.complete(
      String(req.params.id),
      req.userId!,
    );

    auditService.log({
      userId: req.userId!,
      userRole: req.userRole!,
      module: 'Pick List',
      action: 'Complete',
      resourceType: 'PickList',
      resourceId: result.id,
      previousData: oldData,
      newData: result,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string | undefined,
    });

    sendSuccess(res, result);
  });

  cancel = asyncHandler(async (req: Request, res: Response) => {
    const oldData = await this.pickListService.findById(String(req.params.id));
    const result = await this.pickListService.cancel(
      String(req.params.id),
      req.userId!,
    );

    auditService.log({
      userId: req.userId!,
      userRole: req.userRole!,
      module: 'Pick List',
      action: 'Cancel',
      resourceType: 'PickList',
      resourceId: result.id,
      previousData: oldData,
      newData: result,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string | undefined,
    });

    sendSuccess(res, result);
  });
}
