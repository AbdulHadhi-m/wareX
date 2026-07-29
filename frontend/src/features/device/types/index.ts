export type DeviceStatus =
  | 'Available'
  | 'Reserved'
  | 'Picked'
  | 'Shipped'
  | 'Damaged'
  | 'Returned';

export type DeviceCondition = 'New' | 'Open-Box' | 'RMA' | 'Good' | 'Fair' | 'Damaged';

export interface Device {
  id: string;
  deviceName: string;
  brand: string;
  model: string;
  category: string;
  sku?: string;
  serialNumber: string;
  imei?: string;
  binId: string;
  aisleId: string;
  zoneId: string;
  warehouseId: string;
  status: DeviceStatus;
  condition: DeviceCondition;
  purchaseDate?: string;
  warrantyExpiry?: string;
  notes?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeviceData {
  deviceName: string;
  brand: string;
  model: string;
  category: string;
  sku?: string;
  serialNumber: string;
  imei?: string;
  binId: string;
  status: DeviceStatus;
  condition: DeviceCondition;
  purchaseDate?: string;
  warrantyExpiry?: string;
  notes?: string;
}

export interface UpdateDeviceData {
  deviceName?: string;
  brand?: string;
  model?: string;
  category?: string;
  sku?: string;
  serialNumber?: string;
  imei?: string;
  binId?: string;
  status?: DeviceStatus;
  condition?: DeviceCondition;
  purchaseDate?: string;
  warrantyExpiry?: string;
  notes?: string;
}

export interface DeviceListParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: DeviceStatus;
  condition?: DeviceCondition;
  brand?: string;
  category?: string;
  binId?: string;
  aisleId?: string;
  zoneId?: string;
  warehouseId?: string;
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

export interface BinOption extends NamedEntity {
  aisleId: string;
}
