import { MovementHistoryRepository } from './inventory.repository';
import { MoveDeviceDTO, MovementHistoryResponse, DeviceLocationResponse, InventoryQueryResult } from './inventory.types';
export declare class InventoryService {
    private readonly movementHistoryRepository;
    constructor(movementHistoryRepository: MovementHistoryRepository);
    move(dto: MoveDeviceDTO, userId: string): Promise<MovementHistoryResponse>;
    getDeviceLocation(deviceId: string): Promise<DeviceLocationResponse>;
    getDeviceHistory(deviceId: string): Promise<MovementHistoryResponse[]>;
    getByBin(binId: string, pageInput: {
        page?: number;
        limit?: number;
    }): Promise<InventoryQueryResult>;
    getByWarehouse(warehouseId: string, pageInput: {
        page?: number;
        limit?: number;
    }): Promise<InventoryQueryResult>;
    getByZone(zoneId: string, pageInput: {
        page?: number;
        limit?: number;
    }): Promise<InventoryQueryResult>;
    getByAisle(aisleId: string, pageInput: {
        page?: number;
        limit?: number;
    }): Promise<InventoryQueryResult>;
    getByStatus(status: string, pageInput: {
        page?: number;
        limit?: number;
    }): Promise<InventoryQueryResult>;
    getAll(pageInput: {
        page?: number;
        limit?: number;
    }): Promise<InventoryQueryResult>;
    private toMovementHistoryResponse;
    private toInventoryDeviceResponse;
}
//# sourceMappingURL=inventory.service.d.ts.map