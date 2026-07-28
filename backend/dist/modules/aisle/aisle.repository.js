"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AisleRepository = void 0;
const mongoose_1 = require("mongoose");
const aisle_model_1 = require("./aisle.model");
class AisleRepository {
    baseFilter() {
        return { isDeleted: { $ne: true } };
    }
    async findAll() {
        return aisle_model_1.AisleModel.find(this.baseFilter()).sort({ createdAt: -1 }).lean();
    }
    async findById(id) {
        return aisle_model_1.AisleModel.findById(id).where('isDeleted').ne(true).lean();
    }
    async findByZoneId(zoneId) {
        return aisle_model_1.AisleModel.find({ zoneId, ...this.baseFilter() }).sort({ createdAt: -1 }).lean();
    }
    async findByCodeInZone(code, zoneId) {
        return aisle_model_1.AisleModel.findOne({
            code: code.toUpperCase(),
            zoneId,
            ...this.baseFilter(),
        }).lean();
    }
    async findByCodeInZoneExcludingId(code, zoneId, excludeId) {
        return aisle_model_1.AisleModel.findOne({
            code: code.toUpperCase(),
            zoneId,
            _id: { $ne: new mongoose_1.Types.ObjectId(excludeId) },
            ...this.baseFilter(),
        }).lean();
    }
    async create(data) {
        const aisle = await aisle_model_1.AisleModel.create(data);
        return aisle.toObject();
    }
    async update(id, data) {
        return aisle_model_1.AisleModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
            .where('isDeleted').ne(true).lean();
    }
    async softDelete(id, updatedBy) {
        return aisle_model_1.AisleModel.findByIdAndUpdate(id, {
            $set: {
                isDeleted: true,
                deletedAt: new Date(),
                updatedBy,
            },
        }, { new: true }).where('isDeleted').ne(true).lean();
    }
}
exports.AisleRepository = AisleRepository;
//# sourceMappingURL=aisle.repository.js.map