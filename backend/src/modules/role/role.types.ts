export interface IRole {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
  isSuperAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleResponse {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSuperAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleDTO {
  name: string;
  description: string;
  permissionIds: string[];
}

export interface UpdateRoleDTO {
  name?: string;
  description?: string;
  permissionIds?: string[];
}
