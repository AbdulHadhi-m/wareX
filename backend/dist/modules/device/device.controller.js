"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceController = void 0;
const async_handler_1 = require("../../shared/middleware/async-handler");
const api_response_1 = require("../../shared/utils/api-response");
const auditLog_service_1 = require("../audit-log/auditLog.service");
class DeviceController {
    deviceService;
    constructor(deviceService) {
        this.deviceService = deviceService;
    }
    create = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.deviceService.create(req.body, req.userId);
        auditLog_service_1.auditService.log({
            userId: req.userId,
            userRole: req.userRole,
            module: 'Device',
            action: 'Register',
            resourceType: 'Device',
            resourceId: result.id,
            newData: result,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
        (0, api_response_1.sendCreated)(res, result);
    });
    findAll = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.deviceService.search(req.query);
        (0, api_response_1.sendSuccess)(res, result.data, 200, result.meta);
    });
    findById = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.deviceService.findById(String(req.params.id));
        (0, api_response_1.sendSuccess)(res, result);
    });
    update = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const oldData = await this.deviceService.findById(String(req.params.id));
        const result = await this.deviceService.update(String(req.params.id), req.body, req.userId);
        auditLog_service_1.auditService.log({
            userId: req.userId,
            userRole: req.userRole,
            module: 'Device',
            action: 'Update',
            resourceType: 'Device',
            resourceId: result.id,
            previousData: oldData,
            newData: result,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
        (0, api_response_1.sendSuccess)(res, result);
    });
    delete = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const oldData = await this.deviceService.findById(String(req.params.id));
        await this.deviceService.delete(String(req.params.id), req.userId);
        auditLog_service_1.auditService.log({
            userId: req.userId,
            userRole: req.userRole,
            module: 'Device',
            action: 'Delete',
            resourceType: 'Device',
            resourceId: String(req.params.id),
            previousData: oldData,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
        (0, api_response_1.sendNoContent)(res);
    });
}
exports.DeviceController = DeviceController;
//# sourceMappingURL=device.controller.js.map