export type MovementType =
  | 'Initial Placement'
  | 'Transfer'
  | 'Return'
  | 'Adjustment';

export interface InventoryDevice {
  id: string;
  deviceName: string;
  brand: string;
  model: string;
  category: string;
  serialNumber: string;
  sku: string;
  binId: string;
  aisleId: string;
  zoneId: string;
  warehouseId: string;
  status: string;
  condition: string;
}

export interface DeviceLocation {
  bin: { id: string; code: string; name: string };
  aisle: { id: string; code: string; name: string };
  zone: { id: string; code: string; name: string };
  warehouse: { id: string; code: string; name: string };
}

export interface DeviceLocationResponse {
  id: string;
  deviceName: string;
  brand: string;
  model: string;
  serialNumber: string;
  sku: string;
  status: string;
  condition: string;
  location: DeviceLocation;
}

export interface MovementHistoryRecord {
  id: string;
  deviceId: string;
  fromWarehouseId: string | null;
  fromZoneId: string | null;
  fromAisleId: string | null;
  fromBinId: string | null;
  toWarehouseId: string;
  toZoneId: string;
  toAisleId: string;
  toBinId: string;
  movementType: MovementType;
  reason?: string;
  performedBy: string;
  createdAt: string;
}

export interface MoveDeviceData {
  deviceId: string;
  toBinId: string;
  movementType: MovementType;
  reason?: string;
}

export interface InventoryListParams {
  page?: number;
  limit?: number;
  status?: string;
  warehouseId?: string;
  zoneId?: string;
  aisleId?: string;
  binId?: string;
  search?: string;
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
