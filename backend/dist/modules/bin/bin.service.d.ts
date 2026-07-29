import { BinRepository } from './bin.repository';
import { AisleRepository } from '../aisle/aisle.repository';
import { CreateBinDTO, UpdateBinDTO, BinResponse } from './bin.types';
import { type PaginationMeta } from '../../shared/types/api-response';
export declare class BinService {
    private readonly binRepository;
    private readonly aisleRepository;
    constructor(binRepository: BinRepository, aisleRepository: AisleRepository);
    create(dto: CreateBinDTO, userId: string): Promise<BinResponse>;
    findAll(): Promise<BinResponse[]>;
    search(queryParams: Record<string, unknown>): Promise<{
        data: BinResponse[];
        meta: PaginationMeta;
    }>;
    findById(id: string): Promise<BinResponse>;
    findByAisleId(aisleId: string): Promise<BinResponse[]>;
    update(id: string, dto: UpdateBinDTO, userId: string): Promise<BinResponse>;
    delete(id: string, userId: string): Promise<void>;
    private toBinResponse;
}
//# sourceMappingURL=bin.service.d.ts.map