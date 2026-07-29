"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseRepository = void 0;
const mongoose_1 = require("mongoose");
const warehouse_model_1 = require("./warehouse.model");
class WarehouseRepository {
    baseFilter() {
        return { isDeleted: { $ne: true } };
    }
    async findAll() {
        return warehouse_model_1.WarehouseModel.find(this.baseFilter()).sort({ createdAt: -1 }).lean();
    }
    async search(query) {
        const filter = Object.keys(query.filter).length > 0 ? query.filter : this.baseFilter();
        const projection = Object.keys(query.projection).length > 0 ? query.projection : undefined;
        let q = warehouse_model_1.WarehouseModel.find(filter).sort(query.sort).skip(query.skip).limit(query.limit);
        if (projection) {
            q = q.select(projection);
        }
        return q.lean();
    }
    async countSearch(query) {
        const filter = Object.keys(query.filter).length > 0 ? query.filter : this.baseFilter();
        return warehouse_model_1.WarehouseModel.countDocuments(filter);
    }
    async findById(id) {
        return warehouse_model_1.WarehouseModel.findById(id).where('isDeleted').ne(true).lean();
    }
    async findByCode(code) {
        return warehouse_model_1.WarehouseModel.findOne({ code: code.toUpperCase(), ...this.baseFilter() }).lean();
    }
    async findByCodeExcludingId(code, excludeId) {
        return warehouse_model_1.WarehouseModel.findOne({
            code: code.toUpperCase(),
            _id: { $ne: new mongoose_1.Types.ObjectId(excludeId) },
            ...this.baseFilter(),
        }).lean();
    }
    async create(data) {
        const warehouse = await warehouse_model_1.WarehouseModel.create(data);
        return warehouse.toObject();
    }
    async update(id, data) {
        return warehouse_model_1.WarehouseModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
            .where('isDeleted').ne(true).lean();
    }
    async softDelete(id, updatedBy) {
        return warehouse_model_1.WarehouseModel.findByIdAndUpdate(id, {
            $set: {
                isDeleted: true,
                deletedAt: new Date(),
                updatedBy,
            },
        }, { new: true }).where('isDeleted').ne(true).lean();
    }
}
exports.WarehouseRepository = WarehouseRepository;
//# sourceMappingURL=warehouse.repository.js.map