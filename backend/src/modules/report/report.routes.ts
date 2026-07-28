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

router.get('/dashboard', authorize('Manager', 'Worker'), controller.getDashboard);

router.get('/reports/inventory', authorize('Manager'), controller.getInventoryReport);
router.get('/reports/warehouse-utilization', authorize('Manager'), controller.getWarehouseUtilizationReport);
router.get('/reports/device-status', authorize('Manager'), controller.getDeviceStatusReport);
router.get('/reports/pick-list-performance', authorize('Manager'), controller.getPickListPerformanceReport);
router.get('/reports/order-status', authorize('Manager'), controller.getOrderStatusReport);

export { router as reportRouter };
