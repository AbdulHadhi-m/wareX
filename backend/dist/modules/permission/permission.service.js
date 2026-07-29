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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const permission_dto_1 = require("./permission.dto");
const not_found_error_1 = require("../../shared/errors/not-found-error");
const conflict_error_1 = require("../../shared/errors/conflict-error");
class PermissionService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async findAll() {
        const permissions = await this.repository.findAll();
        return permissions.map(permission_dto_1.toPermissionResponse);
    }
    async findByModule(module) {
        const permissions = await this.repository.findByModule(module);
        return permissions.map(permission_dto_1.toPermissionResponse);
    }
    async findById(id) {
        const permission = await this.repository.findById(id);
        if (!permission) {
            throw new not_found_error_1.NotFoundError('Permission not found');
        }
        return (0, permission_dto_1.toPermissionResponse)(permission);
    }
    async create(dto) {
        const exists = await this.repository.existsByCode(dto.code);
        if (exists) {
            throw new conflict_error_1.ConflictError(`Permission with code "${dto.code}" already exists`);
        }
        const permission = await this.repository.create(dto);
        const obj = permission;
        return (0, permission_dto_1.toPermissionResponse)(obj);
    }
    async update(id, dto) {
        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new not_found_error_1.NotFoundError('Permission not found');
        }
        const updated = await this.repository.update(id, dto);
        if (!updated) {
            throw new not_found_error_1.NotFoundError('Permission not found');
        }
        const RoleModel = mongoose_1.default.model('Role');
        const rolesUsingPermission = await RoleModel.find({ permissions: id }).select('_id').lean();
        for (const role of rolesUsingPermission) {
            const { invalidatePermissionCache } = await Promise.resolve().then(() => __importStar(require('../../shared/cache/permission-cache')));
            invalidatePermissionCache(role._id.toString());
        }
        return (0, permission_dto_1.toPermissionResponse)(updated);
    }
    async delete(id) {
        const permission = await this.repository.findById(id);
        if (!permission) {
            throw new not_found_error_1.NotFoundError('Permission not found');
        }
        const RoleModel = mongoose_1.default.model('Role');
        const rolesUsingPermission = await RoleModel.countDocuments({ permissions: id });
        if (rolesUsingPermission > 0) {
            throw new conflict_error_1.ConflictError('Cannot delete permission that is assigned to roles');
        }
        await this.repository.delete(id);
    }
}
exports.PermissionService = PermissionService;
//# sourceMappingURL=permission.service.js.map