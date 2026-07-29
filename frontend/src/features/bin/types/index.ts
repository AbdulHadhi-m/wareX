export type BinStatus = 'Available' | 'Full' | 'Blocked' | 'Inactive';

export interface Bin {
  id: string;
  aisleId: string;
  name: string;
  code: string;
  description?: string;
  capacity: number;
  status: BinStatus;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBinData {
  aisleId: string;
  name: string;
  code: string;
  description?: string;
  capacity: number;
  status: BinStatus;
}

export interface UpdateBinData {
  name?: string;
  code?: string;
  description?: string;
  capacity?: number;
  status?: BinStatus;
}

export interface BinListParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  aisleId?: string;
  status?: BinStatus;
}

export interface NamedEntity {
  id: string;
  name: string;
  code: string;
}

export interface ZoneOption extends NamedEntity {
  warehouseId: string;
}

export interface AisleOption extends NamedEntity {
  zoneId: string;
}
