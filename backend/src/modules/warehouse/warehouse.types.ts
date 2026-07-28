export type WarehouseStatus = 'Active' | 'Inactive';

export interface IWarehouse {
  _id: string;
  name: string;
  code: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  status: WarehouseStatus;
  createdBy: string;
  updatedBy: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWarehouseDTO {
  name: string;
  code: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  status: WarehouseStatus;
}

export interface UpdateWarehouseDTO {
  name?: string;
  code?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  status?: WarehouseStatus;
}

export interface WarehouseResponse {
  id: string;
  name: string;
  code: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  status: WarehouseStatus;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
