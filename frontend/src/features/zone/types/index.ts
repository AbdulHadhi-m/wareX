export type ZoneStatus = 'Active' | 'Inactive';

export interface Zone {
  id: string;
  warehouseId: string;
  name: string;
  code: string;
  description?: string;
  status: ZoneStatus;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateZoneData {
  warehouseId: string;
  name: string;
  code: string;
  description?: string;
  status: ZoneStatus;
}

export interface UpdateZoneData {
  name?: string;
  code?: string;
  description?: string;
  status?: ZoneStatus;
}

export interface ZoneListParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  warehouseId?: string;
  status?: ZoneStatus;
}

export interface WarehouseOption {
  id: string;
  name: string;
  code: string;
}
