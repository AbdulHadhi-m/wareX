"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoneController = void 0;
const async_handler_1 = require("../../shared/middleware/async-handler");
const api_response_1 = require("../../shared/utils/api-response");
const auditLog_service_1 = require("../audit-log/auditLog.service");
class ZoneController {
    zoneService;
    constructor(zoneService) {
        this.zoneService = zoneService;
    }
    create = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.zoneService.create(req.body, req.userId);
        auditLog_service_1.auditService.log({
            userId: req.userId,
            userRole: req.userRole,
            module: 'Zone',
            action: 'Create',
            resourceType: 'Zone',
            resourceId: result.id,
            newData: result,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
        (0, api_response_1.sendCreated)(res, result);
    });
    findAll = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.zoneService.search(req.query);
        (0, api_response_1.sendSuccess)(res, result.data, 200, result.meta);
    });
    findById = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.zoneService.findById(String(req.params.id));
        (0, api_response_1.sendSuccess)(res, result);
    });
    findByWarehouse = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.zoneService.findByWarehouseId(String(req.params.warehouseId));
        (0, api_response_1.sendSuccess)(res, result);
    });
    update = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const oldData = await this.zoneService.findById(String(req.params.id));
        const result = await this.zoneService.update(String(req.params.id), req.body, req.userId);
        auditLog_service_1.auditService.log({
            userId: req.userId,
            userRole: req.userRole,
            module: 'Zone',
            action: 'Update',
            resourceType: 'Zone',
            resourceId: result.id,
            previousData: oldData,
            newData: result,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
        (0, api_response_1.sendSuccess)(res, result);
    });
    delete = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const oldData = await this.zoneService.findById(String(req.params.id));
        await this.zoneService.delete(String(req.params.id), req.userId);
        auditLog_service_1.auditService.log({
            userId: req.userId,
            userRole: req.userRole,
            module: 'Zone',
            action: 'Delete',
            resourceType: 'Zone',
            resourceId: String(req.params.id),
            previousData: oldData,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
        (0, api_response_1.sendNoContent)(res);
    });
}
exports.ZoneController = ZoneController;
//# sourceMappingURL=zone.controller.js.map