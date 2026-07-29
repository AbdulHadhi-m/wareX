"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogController = void 0;
const async_handler_1 = require("../../shared/middleware/async-handler");
const api_response_1 = require("../../shared/utils/api-response");
const pagination_1 = require("../../shared/utils/pagination");
class AuditLogController {
    auditLogService;
    constructor(auditLogService) {
        this.auditLogService = auditLogService;
    }
    findAll = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const { page, limit } = (0, pagination_1.parsePagination)(req.query);
        const result = await this.auditLogService.search({
            userId: req.query.userId,
            module: req.query.module,
            action: req.query.action,
            resourceType: req.query.resourceType,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            page,
            limit,
            sortBy: req.query.sortBy || 'createdAt',
            sortOrder: req.query.sortOrder || 'desc',
        });
        (0, api_response_1.sendSuccess)(res, result.data, 200, result.meta);
    });
    findById = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.auditLogService.findById(String(req.params.id));
        (0, api_response_1.sendSuccess)(res, result);
    });
}
exports.AuditLogController = AuditLogController;
//# sourceMappingURL=auditLog.controller.js.map