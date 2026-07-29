"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const async_handler_1 = require("../../shared/middleware/async-handler");
const api_response_1 = require("../../shared/utils/api-response");
const pagination_1 = require("../../shared/utils/pagination");
class NotificationController {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    create = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.notificationService.create(req.body);
        (0, api_response_1.sendCreated)(res, result);
    });
    findAll = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const { page, limit } = (0, pagination_1.parsePagination)(req.query);
        const result = await this.notificationService.findByRecipient(req.userId, {
            isRead: req.query.isRead === 'true'
                ? true
                : req.query.isRead === 'false'
                    ? false
                    : undefined,
            type: req.query.type,
        }, { page, limit });
        (0, api_response_1.sendSuccess)(res, result.data, 200, result.meta);
    });
    findById = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.notificationService.findById(String(req.params.id), req.userId);
        (0, api_response_1.sendSuccess)(res, result);
    });
    markAsRead = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.notificationService.markAsRead(String(req.params.id), req.userId);
        (0, api_response_1.sendSuccess)(res, result);
    });
    markAllAsRead = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const count = await this.notificationService.markAllAsRead(req.userId);
        (0, api_response_1.sendSuccess)(res, { count });
    });
    delete = (0, async_handler_1.asyncHandler)(async (req, res) => {
        await this.notificationService.delete(String(req.params.id), req.userId);
        (0, api_response_1.sendNoContent)(res);
    });
    unreadCount = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const count = await this.notificationService.getUnreadCount(req.userId);
        (0, api_response_1.sendSuccess)(res, { count });
    });
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map