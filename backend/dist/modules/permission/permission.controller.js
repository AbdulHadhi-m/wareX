"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionController = void 0;
const async_handler_1 = require("../../shared/middleware/async-handler");
const api_response_1 = require("../../shared/utils/api-response");
class PermissionController {
    permissionService;
    constructor(permissionService) {
        this.permissionService = permissionService;
    }
    findAll = (0, async_handler_1.asyncHandler)(async (_req, res) => {
        const permissions = await this.permissionService.findAll();
        (0, api_response_1.sendSuccess)(res, permissions);
    });
    findByModule = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const permissions = await this.permissionService.findByModule(String(req.params.module));
        (0, api_response_1.sendSuccess)(res, permissions);
    });
    findById = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const permission = await this.permissionService.findById(String(req.params.id));
        (0, api_response_1.sendSuccess)(res, permission);
    });
    create = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const permission = await this.permissionService.create(req.body);
        (0, api_response_1.sendCreated)(res, permission);
    });
    update = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const permission = await this.permissionService.update(String(req.params.id), req.body);
        (0, api_response_1.sendSuccess)(res, permission);
    });
    delete = (0, async_handler_1.asyncHandler)(async (req, res) => {
        await this.permissionService.delete(String(req.params.id));
        (0, api_response_1.sendNoContent)(res);
    });
}
exports.PermissionController = PermissionController;
//# sourceMappingURL=permission.controller.js.map