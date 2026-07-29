"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const async_handler_1 = require("../../shared/middleware/async-handler");
const api_response_1 = require("../../shared/utils/api-response");
class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    list = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const search = req.query.search ? String(req.query.search) : undefined;
        const page = req.query.page ? Number(req.query.page) : undefined;
        const limit = req.query.limit ? Number(req.query.limit) : undefined;
        const sortBy = req.query.sortBy ? String(req.query.sortBy) : undefined;
        const sortOrderParam = String(req.query.sortOrder || '');
        const sortOrder = sortOrderParam === 'asc' || sortOrderParam === 'desc' ? sortOrderParam : undefined;
        const roleId = req.query.roleId ? String(req.query.roleId) : undefined;
        const result = await this.adminService.list({
            search,
            page,
            limit,
            sortBy,
            sortOrder,
            roleId,
        });
        (0, api_response_1.sendSuccess)(res, result.data, 200, result.meta);
    });
    getById = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const id = req.params.id;
        const user = await this.adminService.getById(id);
        (0, api_response_1.sendSuccess)(res, user);
    });
    create = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const user = await this.adminService.create(req.body);
        (0, api_response_1.sendCreated)(res, user);
    });
    update = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const id = req.params.id;
        const user = await this.adminService.update(id, req.body);
        (0, api_response_1.sendSuccess)(res, user);
    });
    delete = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const id = req.params.id;
        await this.adminService.delete(id);
        (0, api_response_1.sendNoContent)(res);
    });
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map