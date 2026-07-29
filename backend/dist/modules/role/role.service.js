"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleService = void 0;
const role_dto_1 = require("./role.dto");
const not_found_error_1 = require("../../shared/errors/not-found-error");
const conflict_error_1 = require("../../shared/errors/conflict-error");
const permission_cache_1 = require("../../shared/cache/permission-cache");
class RoleService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async findAll() {
        const roles = await this.repository.findAll();
        return roles.map(role_dto_1.toRoleResponsePopulated);
    }
    async findById(id) {
        const role = await this.repository.findById(id);
        if (!role) {
            throw new not_found_error_1.NotFoundError('Role not found');
        }
        return (0, role_dto_1.toRoleResponsePopulated)(role);
    }
    async create(dto) {
        const exists = await this.repository.existsByName(dto.name);
        if (exists) {
            throw new conflict_error_1.ConflictError(`Role with name "${dto.name}" already exists`);
        }
        const role = await this.repository.create(dto);
        const plain = role;
        return (0, role_dto_1.toRoleResponse)(plain);
    }
    async update(id, dto) {
        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new not_found_error_1.NotFoundError('Role not found');
        }
        const updated = await this.repository.update(id, dto);
        if (!updated) {
            throw new not_found_error_1.NotFoundError('Role not found');
        }
        (0, permission_cache_1.invalidatePermissionCache)(id);
        return (0, role_dto_1.toRoleResponsePopulated)(updated);
    }
    async delete(id) {
        const role = await this.repository.findById(id);
        if (!role) {
            throw new not_found_error_1.NotFoundError('Role not found');
        }
        const mongoose = (await Promise.resolve().then(() => __importStar(require('mongoose')))).default;
        const userCount = await mongoose.model('User').countDocuments({ roleId: id });
        if (userCount > 0) {
            throw new conflict_error_1.ConflictError('Cannot delete role that is assigned to users');
        }
        await this.repository.delete(id);
        (0, permission_cache_1.invalidatePermissionCache)(id);
    }
}
exports.RoleService = RoleService;
//# sourceMappingURL=role.service.js.map