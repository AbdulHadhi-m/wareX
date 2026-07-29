"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const async_handler_1 = require("../../shared/middleware/async-handler");
const api_response_1 = require("../../shared/utils/api-response");
const pagination_1 = require("../../shared/utils/pagination");
const auditLog_service_1 = require("../audit-log/auditLog.service");
class InventoryController {
    inventoryService;
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    move = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.inventoryService.move(req.body, req.userId);
        auditLog_service_1.auditService.log({
            userId: req.userId,
            userRole: req.userRole,
            module: 'Inventory',
            action: 'Device Movement',
            resourceType: 'MovementHistory',
            resourceId: result.id,
            newData: result,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
        (0, api_response_1.sendCreated)(res, result);
    });
    getDeviceLocation = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.inventoryService.getDeviceLocation(String(req.params.deviceId));
        (0, api_response_1.sendSuccess)(res, result);
    });
    getDeviceHistory = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.inventoryService.getDeviceHistory(String(req.params.deviceId));
        (0, api_response_1.sendSuccess)(res, result);
    });
    getByBin = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const { page, limit } = (0, pagination_1.parsePagination)(req.query);
        const result = await this.inventoryService.getByBin(String(req.params.binId), { page, limit });
        const meta = (0, pagination_1.buildPaginationMeta)(result.total, { page: result.page, limit: result.limit, skip: (result.page - 1) * result.limit });
        (0, api_response_1.sendSuccess)(res, result.data, 200, meta);
    });
    getByWarehouse = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const { page, limit } = (0, pagination_1.parsePagination)(req.query);
        const result = await this.inventoryService.getByWarehouse(String(req.params.warehouseId), { page, limit });
        const meta = (0, pagination_1.buildPaginationMeta)(result.total, { page: result.page, limit: result.limit, skip: (result.page - 1) * result.limit });
        (0, api_response_1.sendSuccess)(res, result.data, 200, meta);
    });
    getByZone = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const { page, limit } = (0, pagination_1.parsePagination)(req.query);
        const result = await this.inventoryService.getByZone(String(req.params.zoneId), { page, limit });
        const meta = (0, pagination_1.buildPaginationMeta)(result.total, { page: result.page, limit: result.limit, skip: (result.page - 1) * result.limit });
        (0, api_response_1.sendSuccess)(res, result.data, 200, meta);
    });
    getByAisle = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const { page, limit } = (0, pagination_1.parsePagination)(req.query);
        const result = await this.inventoryService.getByAisle(String(req.params.aisleId), { page, limit });
        const meta = (0, pagination_1.buildPaginationMeta)(result.total, { page: result.page, limit: result.limit, skip: (result.page - 1) * result.limit });
        (0, api_response_1.sendSuccess)(res, result.data, 200, meta);
    });
    getAll = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const { page, limit } = (0, pagination_1.parsePagination)(req.query);
        if (req.query.status) {
            const result = await this.inventoryService.getByStatus(String(req.query.status), { page, limit });
            const meta = (0, pagination_1.buildPaginationMeta)(result.total, { page: result.page, limit: result.limit, skip: (result.page - 1) * result.limit });
            (0, api_response_1.sendSuccess)(res, result.data, 200, meta);
            return;
        }
        const result = await this.inventoryService.getAll({ page, limit });
        const meta = (0, pagination_1.buildPaginationMeta)(result.total, { page: result.page, limit: result.limit, skip: (result.page - 1) * result.limit });
        (0, api_response_1.sendSuccess)(res, result.data, 200, meta);
    });
}
exports.InventoryController = InventoryController;
//# sourceMappingURL=inventory.controller.js.map