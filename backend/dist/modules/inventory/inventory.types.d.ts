export type MovementType = 'Initial Placement' | 'Transfer' | 'Return' | 'Adjustment';
export interface IMovementHistory {
    _id: string;
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
    createdAt: Date;
}
export interface MoveDeviceDTO {
    deviceId: string;
    toBinId: string;
    movementType: MovementType;
    reason?: string;
}
export interface MovementHistoryResponse {
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
export interface InventoryDeviceResponse {
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
export interface DeviceLocationResponse {
    id: string;
    deviceName: string;
    brand: string;
    model: string;
    serialNumber: string;
    sku: string;
    status: string;
    condition: string;
    location: {
        bin: {
            id: string;
            code: string;
            name: string;
        };
        aisle: {
            id: string;
            code: string;
            name: string;
        };
        zone: {
            id: string;
            code: string;
            name: string;
        };
        warehouse: {
            id: string;
            code: string;
            name: string;
        };
    };
}
export interface InventoryQueryResult {
    data: InventoryDeviceResponse[];
    total: number;
    page: number;
    limit: number;
}
//# sourceMappingURL=inventory.types.d.ts.map