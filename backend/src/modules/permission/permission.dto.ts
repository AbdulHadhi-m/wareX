import { IPermission, PermissionResponse } from './permission.types';

export function toPermissionResponse(permission: IPermission): PermissionResponse {
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
