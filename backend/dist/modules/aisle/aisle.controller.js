"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AisleController = void 0;
const async_handler_1 = require("../../shared/middleware/async-handler");
const api_response_1 = require("../../shared/utils/api-response");
class AisleController {
    aisleService;
    constructor(aisleService) {
        this.aisleService = aisleService;
    }
    create = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.aisleService.create(req.body, req.userId);
        (0, api_response_1.sendCreated)(res, result);
    });
    findAll = (0, async_handler_1.asyncHandler)(async (_req, res) => {
        const result = await this.aisleService.findAll();
        (0, api_response_1.sendSuccess)(res, result);
    });
    findById = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.aisleService.findById(String(req.params.id));
        (0, api_response_1.sendSuccess)(res, result);
    });
    findByZone = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.aisleService.findByZoneId(String(req.params.zoneId));
        (0, api_response_1.sendSuccess)(res, result);
    });
    update = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.aisleService.update(String(req.params.id), req.body, req.userId);
        (0, api_response_1.sendSuccess)(res, result);
    });
    delete = (0, async_handler_1.asyncHandler)(async (req, res) => {
        await this.aisleService.delete(String(req.params.id), req.userId);
        (0, api_response_1.sendNoContent)(res);
    });
}
exports.AisleController = AisleController;
//# sourceMappingURL=aisle.controller.js.map