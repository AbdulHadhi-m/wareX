import { IAisle, CreateAisleDTO, UpdateAisleDTO } from './aisle.types';
import { type MongoQuery } from '../../shared/query';
export declare class AisleRepository {
    private baseFilter;
    findAll(): Promise<IAisle[]>;
    search(query: MongoQuery): Promise<IAisle[]>;
    countSearch(query: MongoQuery): Promise<number>;
    findById(id: string): Promise<IAisle | null>;
    findByZoneId(zoneId: string): Promise<IAisle[]>;
    findByCodeInZone(code: string, zoneId: string): Promise<IAisle | null>;
    findByCodeInZoneExcludingId(code: string, zoneId: string, excludeId: string): Promise<IAisle | null>;
    create(data: CreateAisleDTO & {
        createdBy: string;
        updatedBy: string;
    }): Promise<IAisle>;
    update(id: string, data: UpdateAisleDTO & {
        updatedBy: string;
    }): Promise<IAisle | null>;
    softDelete(id: string, updatedBy: string): Promise<IAisle | null>;
}
//# sourceMappingURL=aisle.repository.d.ts.map