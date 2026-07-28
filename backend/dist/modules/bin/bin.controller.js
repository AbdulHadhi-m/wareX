"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinController = void 0;
const async_handler_1 = require("../../shared/middleware/async-handler");
const api_response_1 = require("../../shared/utils/api-response");
class BinController {
    binService;
    constructor(binService) {
        this.binService = binService;
    }
    create = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.binService.create(req.body, req.userId);
        (0, api_response_1.sendCreated)(res, result);
    });
    findAll = (0, async_handler_1.asyncHandler)(async (_req, res) => {
        const result = await this.binService.findAll();
        (0, api_response_1.sendSuccess)(res, result);
    });
    findById = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.binService.findById(String(req.params.id));
        (0, api_response_1.sendSuccess)(res, result);
    });
    findByAisle = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.binService.findByAisleId(String(req.params.aisleId));
        (0, api_response_1.sendSuccess)(res, result);
    });
    update = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.binService.update(String(req.params.id), req.body, req.userId);
        (0, api_response_1.sendSuccess)(res, result);
    });
    delete = (0, async_handler_1.asyncHandler)(async (req, res) => {
        await this.binService.delete(String(req.params.id), req.userId);
        (0, api_response_1.sendNoContent)(res);
    });
}
exports.BinController = BinController;
//# sourceMappingURL=bin.controller.js.map