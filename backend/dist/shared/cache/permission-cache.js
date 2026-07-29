"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCachedPermissions = getCachedPermissions;
exports.setCachedPermissions = setCachedPermissions;
exports.invalidatePermissionCache = invalidatePermissionCache;
exports.invalidateAllPermissionCache = invalidateAllPermissionCache;
const permissionCache = new Map();
function getCachedPermissions(roleId) {
    return permissionCache.get(roleId);
}
function setCachedPermissions(roleId, permissions) {
    permissionCache.set(roleId, permissions);
}
function invalidatePermissionCache(roleId) {
    permissionCache.delete(roleId);
}
function invalidateAllPermissionCache() {
    permissionCache.clear();
}
//# sourceMappingURL=permission-cache.js.map