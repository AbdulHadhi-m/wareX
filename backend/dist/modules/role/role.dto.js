"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toRoleResponse = toRoleResponse;
exports.toRoleResponsePopulated = toRoleResponsePopulated;
function toRoleResponse(role) {
    return {
        id: role._id.toString(),
        name: role.name,
        description: role.description,
        permissions: (role.permissions || []).map((p) => p.toString()),
        isSuperAdmin: role.isSuperAdmin || false,
        createdAt: new Date(role.createdAt).toISOString(),
        updatedAt: new Date(role.updatedAt).toISOString(),
    };
}
function toRoleResponsePopulated(role) {
    const permIds = (role.permissions || []).map((p) => typeof p === 'string' ? p : (p._id?.toString() ?? p.toString()));
    return {
        id: role._id.toString(),
        name: role.name,
        description: role.description,
        permissions: permIds,
        isSuperAdmin: role.isSuperAdmin || false,
        createdAt: new Date(role.createdAt).toISOString(),
        updatedAt: new Date(role.updatedAt).toISOString(),
    };
}
//# sourceMappingURL=role.dto.js.map