export type AisleStatus = 'Active' | 'Inactive';

export interface Aisle {
  id: string;
  zoneId: string;
  name: string;
  code: string;
  description?: string;
  status: AisleStatus;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAisleData {
  zoneId: string;
  name: string;
  code: string;
  description?: string;
  status: AisleStatus;
}

export interface UpdateAisleData {
  name?: string;
  code?: string;
  description?: string;
  status?: AisleStatus;
}

export interface AisleListParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  zoneId?: string;
  status?: AisleStatus;
}

export interface NamedEntity {
  id: string;
  name: string;
  code: string;
}

export interface ZoneInfo extends NamedEntity {
  warehouseId: string;
}
