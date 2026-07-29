"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinController = void 0;
const async_handler_1 = require("../../shared/middleware/async-handler");
const api_response_1 = require("../../shared/utils/api-response");
const auditLog_service_1 = require("../audit-log/auditLog.service");
class BinController {
    binService;
    constructor(binService) {
        this.binService = binService;
    }
    create = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.binService.create(req.body, req.userId);
        auditLog_service_1.auditService.log({
            userId: req.userId,
            userRole: req.userRole,
            module: 'Bin',
            action: 'Create',
            resourceType: 'Bin',
            resourceId: result.id,
            newData: result,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
        (0, api_response_1.sendCreated)(res, result);
    });
    findAll = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.binService.search(req.query);
        (0, api_response_1.sendSuccess)(res, result.data, 200, result.meta);
    });
    findById = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.binService.findById(String(req.params.id));
        (0, api_response_1.sendSuccess)(res, result);
    });
    findByAisle = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.binService.findByAisleId(String(req.params.aisleId));
        (0, api_response_1.sendSuccess)(res, result);
    });
    update = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const oldData = await this.binService.findById(String(req.params.id));
        const result = await this.binService.update(String(req.params.id), req.body, req.userId);
        auditLog_service_1.auditService.log({
            userId: req.userId,
            userRole: req.userRole,
            module: 'Bin',
            action: 'Update',
            resourceType: 'Bin',
            resourceId: result.id,
            previousData: oldData,
            newData: result,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
        (0, api_response_1.sendSuccess)(res, result);
    });
    delete = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const oldData = await this.binService.findById(String(req.params.id));
        await this.binService.delete(String(req.params.id), req.userId);
        auditLog_service_1.auditService.log({
            userId: req.userId,
            userRole: req.userRole,
            module: 'Bin',
            action: 'Delete',
            resourceType: 'Bin',
            resourceId: String(req.params.id),
            previousData: oldData,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
        (0, api_response_1.sendNoContent)(res);
    });
}
exports.BinController = BinController;
//# sourceMappingURL=bin.controller.js.map