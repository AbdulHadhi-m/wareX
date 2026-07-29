"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AisleController = void 0;
const async_handler_1 = require("../../shared/middleware/async-handler");
const api_response_1 = require("../../shared/utils/api-response");
const auditLog_service_1 = require("../audit-log/auditLog.service");
class AisleController {
    aisleService;
    constructor(aisleService) {
        this.aisleService = aisleService;
    }
    create = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.aisleService.create(req.body, req.userId);
        auditLog_service_1.auditService.log({
            userId: req.userId,
            userRole: req.userRole,
            module: 'Aisle',
            action: 'Create',
            resourceType: 'Aisle',
            resourceId: result.id,
            newData: result,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
        (0, api_response_1.sendCreated)(res, result);
    });
    findAll = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.aisleService.search(req.query);
        (0, api_response_1.sendSuccess)(res, result.data, 200, result.meta);
    });
    findById = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.aisleService.findById(String(req.params.id));
        (0, api_response_1.sendSuccess)(res, result);
    });
    findByZone = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.aisleService.findByZoneId(String(req.params.zoneId));
        (0, api_response_1.sendSuccess)(res, result);
    });
    update = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const oldData = await this.aisleService.findById(String(req.params.id));
        const result = await this.aisleService.update(String(req.params.id), req.body, req.userId);
        auditLog_service_1.auditService.log({
            userId: req.userId,
            userRole: req.userRole,
            module: 'Aisle',
            action: 'Update',
            resourceType: 'Aisle',
            resourceId: result.id,
            previousData: oldData,
            newData: result,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
        (0, api_response_1.sendSuccess)(res, result);
    });
    delete = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const oldData = await this.aisleService.findById(String(req.params.id));
        await this.aisleService.delete(String(req.params.id), req.userId);
        auditLog_service_1.auditService.log({
            userId: req.userId,
            userRole: req.userRole,
            module: 'Aisle',
            action: 'Delete',
            resourceType: 'Aisle',
            resourceId: String(req.params.id),
            previousData: oldData,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
        (0, api_response_1.sendNoContent)(res);
    });
}
exports.AisleController = AisleController;
//# sourceMappingURL=aisle.controller.js.map