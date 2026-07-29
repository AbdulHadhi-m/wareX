import { ZoneRepository } from './zone.repository';
import { WarehouseRepository } from '../warehouse/warehouse.repository';
import { CreateZoneDTO, UpdateZoneDTO, ZoneResponse } from './zone.types';
import { type PaginationMeta } from '../../shared/types/api-response';
export declare class ZoneService {
    private readonly zoneRepository;
    private readonly warehouseRepository;
    constructor(zoneRepository: ZoneRepository, warehouseRepository: WarehouseRepository);
    create(dto: CreateZoneDTO, userId: string): Promise<ZoneResponse>;
    findAll(): Promise<ZoneResponse[]>;
    search(queryParams: Record<string, unknown>): Promise<{
        data: ZoneResponse[];
        meta: PaginationMeta;
    }>;
    findById(id: string): Promise<ZoneResponse>;
    findByWarehouseId(warehouseId: string): Promise<ZoneResponse[]>;
    update(id: string, dto: UpdateZoneDTO, userId: string): Promise<ZoneResponse>;
    delete(id: string, userId: string): Promise<void>;
    private toZoneResponse;
}
//# sourceMappingURL=zone.service.d.ts.map