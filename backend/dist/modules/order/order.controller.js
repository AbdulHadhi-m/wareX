"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const async_handler_1 = require("../../shared/middleware/async-handler");
const api_response_1 = require("../../shared/utils/api-response");
const auditLog_service_1 = require("../audit-log/auditLog.service");
class OrderController {
    orderService;
    constructor(orderService) {
        this.orderService = orderService;
    }
    create = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.orderService.create(req.body, req.userId);
        auditLog_service_1.auditService.log({
            userId: req.userId,
            userRole: req.userRole,
            module: 'Order',
            action: 'Create',
            resourceType: 'Order',
            resourceId: result.id,
            newData: result,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
        (0, api_response_1.sendCreated)(res, result);
    });
    findAll = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.orderService.search(req.query);
        (0, api_response_1.sendSuccess)(res, result.data, 200, result.meta);
    });
    findById = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.orderService.findById(String(req.params.id));
        (0, api_response_1.sendSuccess)(res, result);
    });
    update = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const oldData = await this.orderService.findById(String(req.params.id));
        const result = await this.orderService.update(String(req.params.id), req.body, req.userId);
        auditLog_service_1.auditService.log({
            userId: req.userId,
            userRole: req.userRole,
            module: 'Order',
            action: 'Update',
            resourceType: 'Order',
            resourceId: result.id,
            previousData: oldData,
            newData: result,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
        (0, api_response_1.sendSuccess)(res, result);
    });
    cancel = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const oldData = await this.orderService.findById(String(req.params.id));
        const result = await this.orderService.cancel(String(req.params.id), req.userId);
        auditLog_service_1.auditService.log({
            userId: req.userId,
            userRole: req.userRole,
            module: 'Order',
            action: 'Cancel',
            resourceType: 'Order',
            resourceId: result.id,
            previousData: oldData,
            newData: result,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
        (0, api_response_1.sendSuccess)(res, result);
    });
    generatePickList = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.orderService.generatePickList(String(req.params.id), req.userId);
        (0, api_response_1.sendSuccess)(res, result);
    });
    fulfill = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const oldData = await this.orderService.findById(String(req.params.id));
        const result = await this.orderService.fulfill(String(req.params.id), req.userId);
        auditLog_service_1.auditService.log({
            userId: req.userId,
            userRole: req.userRole,
            module: 'Order',
            action: 'Fulfill',
            resourceType: 'Order',
            resourceId: result.id,
            previousData: oldData,
            newData: result,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
        (0, api_response_1.sendSuccess)(res, result);
    });
}
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map