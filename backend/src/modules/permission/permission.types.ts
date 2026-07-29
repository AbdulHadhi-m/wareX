export interface IPermission {
  _id: string;
  name: string;
  code: string;
  module: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PermissionResponse {
  id: string;
  name: string;
  code: string;
  module: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePermissionDTO {
  name: string;
  code: string;
  module: string;
  description: string;
}

export interface UpdatePermissionDTO {
  name?: string;
  description?: string;
}
