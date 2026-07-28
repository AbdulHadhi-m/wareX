export type ZoneStatus = 'Active' | 'Inactive';

export interface IZone {
  _id: string;
  warehouseId: string;
  name: string;
  code: string;
  description?: string;
  status: ZoneStatus;
  createdBy: string;
  updatedBy: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateZoneDTO {
  warehouseId: string;
  name: string;
  code: string;
  description?: string;
  status: ZoneStatus;
}

export interface UpdateZoneDTO {
  name?: string;
  code?: string;
  description?: string;
  status?: ZoneStatus;
}

export interface ZoneResponse {
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
