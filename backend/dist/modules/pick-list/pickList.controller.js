"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickListController = void 0;
const async_handler_1 = require("../../shared/middleware/async-handler");
const api_response_1 = require("../../shared/utils/api-response");
const pagination_1 = require("../../shared/utils/pagination");
const auditLog_service_1 = require("../audit-log/auditLog.service");
class PickListController {
    pickListService;
    constructor(pickListService) {
        this.pickListService = pickListService;
    }
    create = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.pickListService.create(req.body, req.userId);
        auditLog_service_1.auditService.log({
            userId: req.userId,
            userRole: req.userRole,
            module: 'Pick List',
            action: 'Create',
            resourceType: 'PickList',
            resourceId: result.id,
            newData: result,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
        (0, api_response_1.sendCreated)(res, result);
    });
    findAll = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.pickListService.search(req.query, req.userRole, req.userId);
        (0, api_response_1.sendSuccess)(res, result.data, 200, result.meta);
    });
    findById = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.pickListService.findById(String(req.params.id));
        (0, api_response_1.sendSuccess)(res, result);
    });
    getByWorker = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const { page, limit } = (0, pagination_1.parsePagination)(req.query);
        const result = await this.pickListService.getByWorker(String(req.params.workerId), { page, limit });
        (0, api_response_1.sendSuccess)(res, result.data, 200, result.meta);
    });
    assign = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const oldData = await this.pickListService.findById(String(req.params.id));
        const result = await this.pickListService.assign(String(req.params.id), req.body, req.userId);
        auditLog_service_1.auditService.log({
            userId: req.userId,
            userRole: req.userRole,
            module: 'Pick List',
            action: 'Assign',
            resourceType: 'PickList',
            resourceId: result.id,
            previousData: oldData,
            newData: result,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
        (0, api_response_1.sendSuccess)(res, result);
    });
    start = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const oldData = await this.pickListService.findById(String(req.params.id));
        const result = await this.pickListService.start(String(req.params.id), req.userId);
        auditLog_service_1.auditService.log({
            userId: req.userId,
            userRole: req.userRole,
            module: 'Pick List',
            action: 'Start',
            resourceType: 'PickList',
            resourceId: result.id,
            previousData: oldData,
            newData: result,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
        (0, api_response_1.sendSuccess)(res, result);
    });
    complete = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const oldData = await this.pickListService.findById(String(req.params.id));
        const result = await this.pickListService.complete(String(req.params.id), req.userId);
        auditLog_service_1.auditService.log({
            userId: req.userId,
            userRole: req.userRole,
            module: 'Pick List',
            action: 'Complete',
            resourceType: 'PickList',
            resourceId: result.id,
            previousData: oldData,
            newData: result,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
        (0, api_response_1.sendSuccess)(res, result);
    });
    cancel = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const oldData = await this.pickListService.findById(String(req.params.id));
        const result = await this.pickListService.cancel(String(req.params.id), req.userId);
        auditLog_service_1.auditService.log({
            userId: req.userId,
            userRole: req.userRole,
            module: 'Pick List',
            action: 'Cancel',
            resourceType: 'PickList',
            resourceId: result.id,
            previousData: oldData,
            newData: result,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
        (0, api_response_1.sendSuccess)(res, result);
    });
}
exports.PickListController = PickListController;
//# sourceMappingURL=pickList.controller.js.map