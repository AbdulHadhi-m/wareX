"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
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
        if (params.roleId) {
            filter.roleId = new mongoose_1.default.Types.ObjectId(params.roleId);
        }
        const sortField = params.sortBy || 'createdAt';
        const sortOrder = params.sortOrder === 'asc' ? 1 : -1;
        return auth_model_1.UserModel.find(filter)
            .populate('roleId')
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
        if (params.roleId) {
            filter.roleId = new mongoose_1.default.Types.ObjectId(params.roleId);
        }
        return auth_model_1.UserModel.countDocuments(filter);
    }
    async findById(id) {
        return auth_model_1.UserModel.findById(id).populate('roleId').lean();
    }
    async findByEmail(email) {
        return auth_model_1.UserModel.findOne({ email: email.toLowerCase() }).populate('roleId').lean();
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
        if (data.roleId !== undefined)
            updateData.roleId = data.roleId;
        if (Object.keys(updateData).length === 0)
            return null;
        return auth_model_1.UserModel.findByIdAndUpdate(id, { $set: updateData }, { new: true })
            .populate('roleId')
            .lean();
    }
    async delete(id) {
        return auth_model_1.UserModel.findByIdAndDelete(id).lean();
    }
}
exports.AdminRepository = AdminRepository;
//# sourceMappingURL=admin.repository.js.map