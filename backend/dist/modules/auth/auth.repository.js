"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const auth_model_1 = require("./auth.model");
class AuthRepository {
    async findByEmail(email) {
        return auth_model_1.UserModel.findOne({ email: email.toLowerCase() }).lean();
    }
    async findByEmailWithPassword(email) {
        return auth_model_1.UserModel.findOne({ email: email.toLowerCase() }).select('+password').lean();
    }
    async findById(id) {
        return auth_model_1.UserModel.findById(id).lean();
    }
    async create(data) {
        const user = await auth_model_1.UserModel.create(data);
        const obj = user.toObject();
        const { password: _, ...userWithoutPassword } = obj;
        return userWithoutPassword;
    }
    async existsByEmail(email) {
        const count = await auth_model_1.UserModel.countDocuments({ email: email.toLowerCase() });
        return count > 0;
    }
}
exports.AuthRepository = AuthRepository;
//# sourceMappingURL=auth.repository.js.map