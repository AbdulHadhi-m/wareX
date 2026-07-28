"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinRepository = void 0;
const mongoose_1 = require("mongoose");
const bin_model_1 = require("./bin.model");
class BinRepository {
    baseFilter() {
        return { isDeleted: { $ne: true } };
    }
    async findAll() {
        return bin_model_1.BinModel.find(this.baseFilter()).sort({ createdAt: -1 }).lean();
    }
    async findById(id) {
        return bin_model_1.BinModel.findById(id).where('isDeleted').ne(true).lean();
    }
    async findByAisleId(aisleId) {
        return bin_model_1.BinModel.find({ aisleId, ...this.baseFilter() }).sort({ createdAt: -1 }).lean();
    }
    async findByCodeInAisle(code, aisleId) {
        return bin_model_1.BinModel.findOne({
            code: code.toUpperCase(),
            aisleId,
            ...this.baseFilter(),
        }).lean();
    }
    async findByCodeInAisleExcludingId(code, aisleId, excludeId) {
        return bin_model_1.BinModel.findOne({
            code: code.toUpperCase(),
            aisleId,
            _id: { $ne: new mongoose_1.Types.ObjectId(excludeId) },
            ...this.baseFilter(),
        }).lean();
    }
    async create(data) {
        const bin = await bin_model_1.BinModel.create(data);
        return bin.toObject();
    }
    async update(id, data) {
        return bin_model_1.BinModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
            .where('isDeleted').ne(true).lean();
    }
    async softDelete(id, updatedBy) {
        return bin_model_1.BinModel.findByIdAndUpdate(id, {
            $set: {
                isDeleted: true,
                deletedAt: new Date(),
                updatedBy,
            },
        }, { new: true }).where('isDeleted').ne(true).lean();
    }
}
exports.BinRepository = BinRepository;
//# sourceMappingURL=bin.repository.js.map