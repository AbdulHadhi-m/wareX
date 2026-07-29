"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const auth_model_1 = require("../auth/auth.model");
class AdminRepository {
    async findAll(params) {
        const filter = {};
        if (params.search) {
            filter.$or = [
                { name: { $regex: params.search, $options: 'i' } },
                { email: { $regex: params.search, $options: 'i' } },
            ];
        }
        if (params.role) {
            filter.role = params.role;
        }
        const sortField = params.sortBy || 'createdAt';
        const sortOrder = params.sortOrder === 'asc' ? 1 : -1;
        return auth_model_1.UserModel.find(filter)
            .sort({ [sortField]: sortOrder })
            .skip(((params.page ?? 1) - 1) * (params.limit ?? 10))
            .limit(params.limit ?? 10)
            .lean();
    }
    async count(params) {
        const filter = {};
        if (params.search) {
            filter.$or = [
                { name: { $regex: params.search, $options: 'i' } },
                { email: { $regex: params.search, $options: 'i' } },
            ];
        }
        if (params.role) {
            filter.role = params.role;
        }
        return auth_model_1.UserModel.countDocuments(filter);
    }
    async findById(id) {
        return auth_model_1.UserModel.findById(id).lean();
    }
    async findByEmail(email) {
        return auth_model_1.UserModel.findOne({ email: email.toLowerCase() }).lean();
    }
    async create(data) {
        const user = await auth_model_1.UserModel.create(data);
        const obj = user.toObject();
        const { password: _, ...userWithoutPassword } = obj;
        return userWithoutPassword;
    }
    async update(id, data) {
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.email !== undefined)
            updateData.email = data.email;
        if (data.password !== undefined)
            updateData.password = data.password;
        if (data.role !== undefined)
            updateData.role = data.role;
        if (Object.keys(updateData).length === 0)
            return null;
        return auth_model_1.UserModel.findByIdAndUpdate(id, { $set: updateData }, { new: true }).lean();
    }
    async delete(id) {
        return auth_model_1.UserModel.findByIdAndDelete(id).lean();
    }
}
exports.AdminRepository = AdminRepository;
//# sourceMappingURL=admin.repository.js.map