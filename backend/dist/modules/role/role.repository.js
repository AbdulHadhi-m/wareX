"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRepository = void 0;
const role_model_1 = require("./role.model");
class RoleRepository {
    async findAll() {
        return role_model_1.RoleModel.find().populate('permissions').sort({ name: 1 }).lean();
    }
    async findById(id) {
        return role_model_1.RoleModel.findById(id).populate('permissions').lean();
    }
    async findByName(name) {
        return role_model_1.RoleModel.findOne({ name }).populate('permissions').lean();
    }
    async create(data) {
        const role = await role_model_1.RoleModel.create(data);
        return role.toObject();
    }
    async update(id, data) {
        return role_model_1.RoleModel.findByIdAndUpdate(id, { $set: data }, { new: true }).populate('permissions').lean();
    }
    async delete(id) {
        return role_model_1.RoleModel.findByIdAndDelete(id).lean();
    }
    async existsByName(name) {
        const count = await role_model_1.RoleModel.countDocuments({ name });
        return count > 0;
    }
    async count() {
        return role_model_1.RoleModel.countDocuments();
    }
}
exports.RoleRepository = RoleRepository;
//# sourceMappingURL=role.repository.js.map