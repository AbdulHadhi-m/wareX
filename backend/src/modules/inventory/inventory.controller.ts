import { Request, Response } from 'express';
import { InventoryService } from './inventory.service';
import { asyncHandler } from '../../shared/middleware/async-handler';
import { sendCreated, sendSuccess } from '../../shared/utils/api-response';
import { parsePagination, buildPaginationMeta } from '../../shared/utils/pagination';
import { auditService } from '../audit-log/auditLog.service';

export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  move = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.inventoryService.move(req.body, req.userId!);

    auditService.log({
      userId: req.userId!,
      userRole: req.userRole!,
      module: 'Inventory',
      action: 'Device Movement',
      resourceType: 'MovementHistory',
      resourceId: result.id,
      newData: result,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string | undefined,
    });

    sendCreated(res, result);
  });

  getDeviceLocation = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.inventoryService.getDeviceLocation(
      String(req.params.deviceId),
    );
    sendSuccess(res, result);
  });

  getDeviceHistory = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.inventoryService.getDeviceHistory(
      String(req.params.deviceId),
    );
    sendSuccess(res, result);
  });

  getByBin = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);
    const result = await this.inventoryService.getByBin(
      String(req.params.binId),
      { page, limit },
    );
    const meta = buildPaginationMeta(result.total, { page: result.page, limit: result.limit, skip: (result.page - 1) * result.limit });
    sendSuccess(res, result.data, 200, meta);
  });

  getByWarehouse = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);
    const result = await this.inventoryService.getByWarehouse(
      String(req.params.warehouseId),
      { page, limit },
    );
    const meta = buildPaginationMeta(result.total, { page: result.page, limit: result.limit, skip: (result.page - 1) * result.limit });
    sendSuccess(res, result.data, 200, meta);
  });

  getByZone = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);
    const result = await this.inventoryService.getByZone(
      String(req.params.zoneId),
      { page, limit },
    );
    const meta = buildPaginationMeta(result.total, { page: result.page, limit: result.limit, skip: (result.page - 1) * result.limit });
    sendSuccess(res, result.data, 200, meta);
  });

  getByAisle = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);
    const result = await this.inventoryService.getByAisle(
      String(req.params.aisleId),
      { page, limit },
    );
    const meta = buildPaginationMeta(result.total, { page: result.page, limit: result.limit, skip: (result.page - 1) * result.limit });
    sendSuccess(res, result.data, 200, meta);
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);

    if (req.query.status) {
      const result = await this.inventoryService.getByStatus(
        String(req.query.status),
        { page, limit },
      );
      const meta = buildPaginationMeta(result.total, { page: result.page, limit: result.limit, skip: (result.page - 1) * result.limit });
      sendSuccess(res, result.data, 200, meta);
      return;
    }

    const result = await this.inventoryService.getAll({ page, limit });
    const meta = buildPaginationMeta(result.total, { page: result.page, limit: result.limit, skip: (result.page - 1) * result.limit });
    sendSuccess(res, result.data, 200, meta);
  });
}
