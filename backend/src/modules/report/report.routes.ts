import { Router } from 'express';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { ReportRepository } from './report.repository';
import { authenticate, authorize } from '../auth/auth.middleware';

const reportRepository = new ReportRepository();
const reportService = new ReportService(reportRepository);
const controller = new ReportController(reportService);

const router = Router();
router.use(authenticate);

router.get('/dashboard', authorize('report.view-dashboard'), controller.getDashboard);

router.get('/reports/inventory', authorize('report.view-inventory'), controller.getInventoryReport);
router.get('/reports/warehouse-utilization', authorize('report.view-warehouse-utilization'), controller.getWarehouseUtilizationReport);
router.get('/reports/device-status', authorize('report.view-device-status'), controller.getDeviceStatusReport);
router.get('/reports/pick-list-performance', authorize('report.view-pick-list-performance'), controller.getPickListPerformanceReport);
router.get('/reports/order-status', authorize('report.view-order-status'), controller.getOrderStatusReport);

export { router as reportRouter };
