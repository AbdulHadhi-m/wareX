"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseController = void 0;
const async_handler_1 = require("../../shared/middleware/async-handler");
const api_response_1 = require("../../shared/utils/api-response");
class WarehouseController {
    warehouseService;
    constructor(warehouseService) {
        this.warehouseService = warehouseService;
    }
    create = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.warehouseService.create(req.body, req.userId);
        (0, api_response_1.sendCreated)(res, result);
    });
    findAll = (0, async_handler_1.asyncHandler)(async (_req, res) => {
        const result = await this.warehouseService.findAll();
        (0, api_response_1.sendSuccess)(res, result);
    });
    findById = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.warehouseService.findById(String(req.params.id));
        (0, api_response_1.sendSuccess)(res, result);
    });
    update = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.warehouseService.update(String(req.params.id), req.body, req.userId);
        (0, api_response_1.sendSuccess)(res, result);
    });
    delete = (0, async_handler_1.asyncHandler)(async (req, res) => {
        await this.warehouseService.delete(String(req.params.id), req.userId);
        (0, api_response_1.sendNoContent)(res);
    });
}
exports.WarehouseController = WarehouseController;
//# sourceMappingURL=warehouse.controller.js.map