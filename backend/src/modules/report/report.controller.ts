import { Request, Response } from 'express';
import { ReportService } from './report.service';
import { asyncHandler } from '../../shared/middleware/async-handler';
import { sendSuccess } from '../../shared/utils/api-response';

export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  getDashboard = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.reportService.getDashboard(req.userId!);
    sendSuccess(res, result);
  });

  getInventoryReport = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.reportService.getInventoryReport({
      warehouseId: req.query.warehouseId as string | undefined,
      zoneId: req.query.zoneId as string | undefined,
      aisleId: req.query.aisleId as string | undefined,
      binId: req.query.binId as string | undefined,
      status: req.query.status as string | undefined,
    });
    sendSuccess(res, result);
  });

  getWarehouseUtilizationReport = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this.reportService.getWarehouseUtilizationReport();
    sendSuccess(res, result);
  });

  getDeviceStatusReport = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.reportService.getDeviceStatusReport({
      warehouseId: req.query.warehouseId as string | undefined,
      zoneId: req.query.zoneId as string | undefined,
      aisleId: req.query.aisleId as string | undefined,
    });
    sendSuccess(res, result);
  });

  getPickListPerformanceReport = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.reportService.getPickListPerformanceReport({
      workerId: req.query.workerId as string | undefined,
      dateFrom: req.query.dateFrom as string | undefined,
      dateTo: req.query.dateTo as string | undefined,
    });
    sendSuccess(res, result);
  });

  getOrderStatusReport = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.reportService.getOrderStatusReport({
      dateFrom: req.query.dateFrom as string | undefined,
      dateTo: req.query.dateTo as string | undefined,
    });
    sendSuccess(res, result);
  });
}
