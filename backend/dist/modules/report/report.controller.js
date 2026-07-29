"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const async_handler_1 = require("../../shared/middleware/async-handler");
const api_response_1 = require("../../shared/utils/api-response");
class ReportController {
    reportService;
    constructor(reportService) {
        this.reportService = reportService;
    }
    getDashboard = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.reportService.getDashboard(req.userId);
        (0, api_response_1.sendSuccess)(res, result);
    });
    getInventoryReport = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.reportService.getInventoryReport({
            warehouseId: req.query.warehouseId,
            zoneId: req.query.zoneId,
            aisleId: req.query.aisleId,
            binId: req.query.binId,
            status: req.query.status,
        });
        (0, api_response_1.sendSuccess)(res, result);
    });
    getWarehouseUtilizationReport = (0, async_handler_1.asyncHandler)(async (_req, res) => {
        const result = await this.reportService.getWarehouseUtilizationReport();
        (0, api_response_1.sendSuccess)(res, result);
    });
    getDeviceStatusReport = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.reportService.getDeviceStatusReport({
            warehouseId: req.query.warehouseId,
            zoneId: req.query.zoneId,
            aisleId: req.query.aisleId,
        });
        (0, api_response_1.sendSuccess)(res, result);
    });
    getPickListPerformanceReport = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.reportService.getPickListPerformanceReport({
            workerId: req.query.workerId,
            dateFrom: req.query.dateFrom,
            dateTo: req.query.dateTo,
        });
        (0, api_response_1.sendSuccess)(res, result);
    });
    getOrderStatusReport = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.reportService.getOrderStatusReport({
            dateFrom: req.query.dateFrom,
            dateTo: req.query.dateTo,
        });
        (0, api_response_1.sendSuccess)(res, result);
    });
}
exports.ReportController = ReportController;
//# sourceMappingURL=report.controller.js.map