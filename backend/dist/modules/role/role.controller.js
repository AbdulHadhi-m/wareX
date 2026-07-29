"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleController = void 0;
const async_handler_1 = require("../../shared/middleware/async-handler");
const api_response_1 = require("../../shared/utils/api-response");
class RoleController {
    roleService;
    constructor(roleService) {
        this.roleService = roleService;
    }
    findAll = (0, async_handler_1.asyncHandler)(async (_req, res) => {
        const roles = await this.roleService.findAll();
        (0, api_response_1.sendSuccess)(res, roles);
    });
    findById = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const role = await this.roleService.findById(String(req.params.id));
        (0, api_response_1.sendSuccess)(res, role);
    });
    create = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const role = await this.roleService.create(req.body);
        (0, api_response_1.sendCreated)(res, role);
    });
    update = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const role = await this.roleService.update(String(req.params.id), req.body);
        (0, api_response_1.sendSuccess)(res, role);
    });
    delete = (0, async_handler_1.asyncHandler)(async (req, res) => {
        await this.roleService.delete(String(req.params.id));
        (0, api_response_1.sendNoContent)(res);
    });
}
exports.RoleController = RoleController;
//# sourceMappingURL=role.controller.js.map