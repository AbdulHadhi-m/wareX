import { IZone, CreateZoneDTO, UpdateZoneDTO } from './zone.types';
import { type MongoQuery } from '../../shared/query';
export declare class ZoneRepository {
    private baseFilter;
    findAll(): Promise<IZone[]>;
    search(query: MongoQuery): Promise<IZone[]>;
    countSearch(query: MongoQuery): Promise<number>;
    findById(id: string): Promise<IZone | null>;
    findByWarehouseId(warehouseId: string): Promise<IZone[]>;
    findByCodeInWarehouse(code: string, warehouseId: string): Promise<IZone | null>;
    findByCodeInWarehouseExcludingId(code: string, warehouseId: string, excludeId: string): Promise<IZone | null>;
    create(data: CreateZoneDTO & {
        createdBy: string;
        updatedBy: string;
    }): Promise<IZone>;
    update(id: string, data: UpdateZoneDTO & {
        updatedBy: string;
    }): Promise<IZone | null>;
    softDelete(id: string, updatedBy: string): Promise<IZone | null>;
}
//# sourceMappingURL=zone.repository.d.ts.map