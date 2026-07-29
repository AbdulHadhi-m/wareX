const permissionCache = new Map<string, Set<string>>();

export function getCachedPermissions(roleId: string): Set<string> | undefined {
  return permissionCache.get(roleId);
}

export function setCachedPermissions(roleId: string, permissions: Set<string>): void {
  permissionCache.set(roleId, permissions);
}

export function invalidatePermissionCache(roleId: string): void {
  permissionCache.delete(roleId);
}

export function invalidateAllPermissionCache(): void {
  permissionCache.clear();
}
