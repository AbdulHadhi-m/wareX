"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceController = void 0;
const async_handler_1 = require("../../shared/middleware/async-handler");
const api_response_1 = require("../../shared/utils/api-response");
const pagination_1 = require("../../shared/utils/pagination");
class DeviceController {
    deviceService;
    constructor(deviceService) {
        this.deviceService = deviceService;
    }
    create = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.deviceService.create(req.body, req.userId);
        (0, api_response_1.sendCreated)(res, result);
    });
    findAll = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const { page, limit } = (0, pagination_1.parsePagination)(req.query);
        const result = await this.deviceService.search({
            deviceName: req.query.deviceName,
            brand: req.query.brand,
            model: req.query.model,
            category: req.query.category,
            status: req.query.status,
            condition: req.query.condition,
            binId: req.query.binId,
            aisleId: req.query.aisleId,
            zoneId: req.query.zoneId,
            warehouseId: req.query.warehouseId,
            page,
            limit,
            sortBy: req.query.sortBy || 'createdAt',
            sortOrder: req.query.sortOrder || 'desc',
        });
        (0, api_response_1.sendSuccess)(res, result.data, 200, result.meta);
    });
    findById = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.deviceService.findById(String(req.params.id));
        (0, api_response_1.sendSuccess)(res, result);
    });
    update = (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await this.deviceService.update(String(req.params.id), req.body, req.userId);
        (0, api_response_1.sendSuccess)(res, result);
    });
    delete = (0, async_handler_1.asyncHandler)(async (req, res) => {
        await this.deviceService.delete(String(req.params.id), req.userId);
        (0, api_response_1.sendNoContent)(res);
    });
}
exports.DeviceController = DeviceController;
//# sourceMappingURL=device.controller.js.map