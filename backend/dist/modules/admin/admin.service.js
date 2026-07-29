"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const conflict_error_1 = require("../../shared/errors/conflict-error");
const not_found_error_1 = require("../../shared/errors/not-found-error");
const pagination_1 = require("../../shared/utils/pagination");
const SALT_ROUNDS = 12;
class AdminService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async list(params) {
        const pagination = (0, pagination_1.parsePagination)({ page: params.page, limit: params.limit });
        const [users, total] = await Promise.all([
            this.repository.findAll({ ...params, page: pagination.page, limit: pagination.limit }),
            this.repository.count(params),
        ]);
        return {
            data: users.map((u) => this.toResponse(u)),
            meta: (0, pagination_1.buildPaginationMeta)(total, pagination),
        };
    }
    async getById(id) {
        const user = await this.repository.findById(id);
        if (!user)
            throw new not_found_error_1.NotFoundError('User not found');
        return this.toResponse(user);
    }
    async create(dto) {
        const exists = await this.repository.findByEmail(dto.email);
        if (exists)
            throw new conflict_error_1.ConflictError('A user with this email already exists');
        const RoleModel = mongoose_1.default.model('Role');
        const role = await RoleModel.findById(dto.roleId).lean();
        if (!role)
            throw new not_found_error_1.NotFoundError('Role not found');
        const hashedPassword = await bcrypt_1.default.hash(dto.password, SALT_ROUNDS);
        const user = await this.repository.create({ ...dto, password: hashedPassword });
        return this.toResponse(user);
    }
    async update(id, dto) {
        const existing = await this.repository.findById(id);
        if (!existing)
            throw new not_found_error_1.NotFoundError('User not found');
        if (dto.email && dto.email !== existing.email) {
            const emailExists = await this.repository.findByEmail(dto.email);
            if (emailExists)
                throw new conflict_error_1.ConflictError('A user with this email already exists');
        }
        if (dto.roleId) {
            const RoleModel = mongoose_1.default.model('Role');
            const role = await RoleModel.findById(dto.roleId).lean();
            if (!role)
                throw new not_found_error_1.NotFoundError('Role not found');
        }
        const updateData = { ...dto };
        if (dto.password) {
            updateData.password = await bcrypt_1.default.hash(dto.password, SALT_ROUNDS);
        }
        const updated = await this.repository.update(id, updateData);
        if (!updated)
            throw new not_found_error_1.NotFoundError('User not found');
        return this.toResponse(updated);
    }
    async delete(id) {
        const user = await this.repository.findById(id);
        if (!user)
            throw new not_found_error_1.NotFoundError('User not found');
        await this.repository.delete(id);
    }
    toResponse(user) {
        const roleObj = user.roleId;
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: roleObj?.name ?? 'Unknown',
            roleId: (roleObj?._id ?? user.roleId ?? '').toString(),
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        };
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map