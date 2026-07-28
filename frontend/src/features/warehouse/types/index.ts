export type WarehouseStatus = 'Active' | 'Inactive';

export interface Warehouse {
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

export interface CreateWarehouseData {
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

export interface UpdateWarehouseData {
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

export interface WarehouseListParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: WarehouseStatus;
  country?: string;
  city?: string;
}
