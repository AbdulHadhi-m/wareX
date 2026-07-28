export type DeviceStatus = 'Available' | 'Reserved' | 'Picked' | 'Shipped' | 'Damaged' | 'Returned';
export type DeviceCondition = 'New' | 'Good' | 'Fair' | 'Damaged';
export interface IDevice {
    _id: string;
    deviceName: string;
    brand: string;
    model: string;
    category: string;
    imei?: string;
    serialNumber: string;
    sku: string;
    binId: string;
    aisleId: string;
    zoneId: string;
    warehouseId: string;
    status: DeviceStatus;
    condition: DeviceCondition;
    purchaseDate?: Date;
    warrantyExpiry?: Date;
    notes?: string;
    createdBy: string;
    updatedBy: string;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateDeviceDTO {
    deviceName: string;
    brand: string;
    model: string;
    category: string;
    imei?: string;
    serialNumber: string;
    sku: string;
    binId: string;
    status: DeviceStatus;
    condition: DeviceCondition;
    purchaseDate?: string;
    warrantyExpiry?: string;
    notes?: string;
}
export interface UpdateDeviceDTO {
    deviceName?: string;
    brand?: string;
    model?: string;
    category?: string;
    imei?: string;
    serialNumber?: string;
    sku?: string;
    binId?: string;
    status?: DeviceStatus;
    condition?: DeviceCondition;
    purchaseDate?: string;
    warrantyExpiry?: string;
    notes?: string;
}
export interface DeviceResponse {
    id: string;
    deviceName: string;
    brand: string;
    model: string;
    category: string;
    imei?: string;
    serialNumber: string;
    sku: string;
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
export interface DeviceSearchParams {
    deviceName?: string;
    brand?: string;
    model?: string;
    category?: string;
    status?: DeviceStatus;
    condition?: DeviceCondition;
    binId?: string;
    aisleId?: string;
    zoneId?: string;
    warehouseId?: string;
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}
export interface DeviceSearchResult {
    data: DeviceResponse[];
    total: number;
    page: number;
    limit: number;
}
//# sourceMappingURL=device.types.d.ts.map