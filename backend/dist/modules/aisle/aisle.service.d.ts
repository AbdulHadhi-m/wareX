import { AisleRepository } from './aisle.repository';
import { ZoneRepository } from '../zone/zone.repository';
import { CreateAisleDTO, UpdateAisleDTO, AisleResponse } from './aisle.types';
import { type PaginationMeta } from '../../shared/types/api-response';
export declare class AisleService {
    private readonly aisleRepository;
    private readonly zoneRepository;
    constructor(aisleRepository: AisleRepository, zoneRepository: ZoneRepository);
    create(dto: CreateAisleDTO, userId: string): Promise<AisleResponse>;
    findAll(): Promise<AisleResponse[]>;
    search(queryParams: Record<string, unknown>): Promise<{
        data: AisleResponse[];
        meta: PaginationMeta;
    }>;
    findById(id: string): Promise<AisleResponse>;
    findByZoneId(zoneId: string): Promise<AisleResponse[]>;
    update(id: string, dto: UpdateAisleDTO, userId: string): Promise<AisleResponse>;
    delete(id: string, userId: string): Promise<void>;
    private toAisleResponse;
}
//# sourceMappingURL=aisle.service.d.ts.map