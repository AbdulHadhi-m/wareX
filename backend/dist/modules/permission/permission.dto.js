"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPermissionResponse = toPermissionResponse;
function toPermissionResponse(permission) {
    return {
        id: permission._id.toString(),
        name: permission.name,
        code: permission.code,
        module: permission.module,
        description: permission.description,
        createdAt: new Date(permission.createdAt).toISOString(),
        updatedAt: new Date(permission.updatedAt).toISOString(),
    };
}
//# sourceMappingURL=permission.dto.js.map