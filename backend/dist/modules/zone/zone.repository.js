"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoneRepository = void 0;
const mongoose_1 = require("mongoose");
const zone_model_1 = require("./zone.model");
class ZoneRepository {
    baseFilter() {
        return { isDeleted: { $ne: true } };
    }
    async findAll() {
        return zone_model_1.ZoneModel.find(this.baseFilter()).sort({ createdAt: -1 }).lean();
    }
    async findById(id) {
        return zone_model_1.ZoneModel.findById(id).where('isDeleted').ne(true).lean();
    }
    async findByWarehouseId(warehouseId) {
        return zone_model_1.ZoneModel.find({ warehouseId, ...this.baseFilter() }).sort({ createdAt: -1 }).lean();
    }
    async findByCodeInWarehouse(code, warehouseId) {
        return zone_model_1.ZoneModel.findOne({
            code: code.toUpperCase(),
            warehouseId,
            ...this.baseFilter(),
        }).lean();
    }
    async findByCodeInWarehouseExcludingId(code, warehouseId, excludeId) {
        return zone_model_1.ZoneModel.findOne({
            code: code.toUpperCase(),
            warehouseId,
            _id: { $ne: new mongoose_1.Types.ObjectId(excludeId) },
            ...this.baseFilter(),
        }).lean();
    }
    async create(data) {
        const zone = await zone_model_1.ZoneModel.create(data);
        return zone.toObject();
    }
    async update(id, data) {
        return zone_model_1.ZoneModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
            .where('isDeleted').ne(true).lean();
    }
    async softDelete(id, updatedBy) {
        return zone_model_1.ZoneModel.findByIdAndUpdate(id, {
            $set: {
                isDeleted: true,
                deletedAt: new Date(),
                updatedBy,
            },
        }, { new: true }).where('isDeleted').ne(true).lean();
    }
}
exports.ZoneRepository = ZoneRepository;
//# sourceMappingURL=zone.repository.js.map