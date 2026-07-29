"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionRepository = void 0;
const permission_model_1 = require("./permission.model");
class PermissionRepository {
    async findAll() {
        return permission_model_1.PermissionModel.find().sort({ module: 1, code: 1 }).lean();
    }
    async findByModule(module) {
        return permission_model_1.PermissionModel.find({ module }).sort({ code: 1 }).lean();
    }
    async findById(id) {
        return permission_model_1.PermissionModel.findById(id).lean();
    }
    async findByCode(code) {
        return permission_model_1.PermissionModel.findOne({ code }).lean();
    }
    async create(data) {
        const permission = await permission_model_1.PermissionModel.create(data);
        return permission.toObject();
    }
    async update(id, data) {
        return permission_model_1.PermissionModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
    }
    async delete(id) {
        return permission_model_1.PermissionModel.findByIdAndDelete(id).lean();
    }
    async existsByCode(code) {
        const count = await permission_model_1.PermissionModel.countDocuments({ code });
        return count > 0;
    }
    async findByCodes(codes) {
        return permission_model_1.PermissionModel.find({ code: { $in: codes } }).lean();
    }
}
exports.PermissionRepository = PermissionRepository;
//# sourceMappingURL=permission.repository.js.map