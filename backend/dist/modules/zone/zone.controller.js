"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoneController = void 0;
const async_handler_1 = require("../../shared/middleware/async-handler");
const api_response_1 = require("../../shared/utils/api-response");
class ZoneController {
    zoneService;
    constructor(zoneService) {
        this.zoneService = zoneService;
    }
    create = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.zoneService.create(req.body, req.userId);
        (0, api_response_1.sendCreated)(res, result);
    });
    findAll = (0, async_handler_1.asyncHandler)(async (_req, res) => {
        const result = await this.zoneService.findAll();
        (0, api_response_1.sendSuccess)(res, result);
    });
    findById = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.zoneService.findById(String(req.params.id));
        (0, api_response_1.sendSuccess)(res, result);
    });
    findByWarehouse = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.zoneService.findByWarehouseId(String(req.params.warehouseId));
        (0, api_response_1.sendSuccess)(res, result);
    });
    update = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.zoneService.update(String(req.params.id), req.body, req.userId);
        (0, api_response_1.sendSuccess)(res, result);
    });
    delete = (0, async_handler_1.asyncHandler)(async (req, res) => {
        await this.zoneService.delete(String(req.params.id), req.userId);
        (0, api_response_1.sendNoContent)(res);
    });
}
exports.ZoneController = ZoneController;
//# sourceMappingURL=zone.controller.js.map