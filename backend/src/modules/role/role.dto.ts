import { IRole, RoleResponse } from './role.types';

export function toRoleResponse(role: IRole): RoleResponse {
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

export function toRoleResponsePopulated(role: any): RoleResponse {
  const permIds = (role.permissions || []).map((p: any) =>
    typeof p === 'string' ? p : (p._id?.toString() ?? p.toString()),
  );
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
