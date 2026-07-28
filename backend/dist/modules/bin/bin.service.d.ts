import { BinRepository } from './bin.repository';
import { AisleRepository } from '../aisle/aisle.repository';
import { CreateBinDTO, UpdateBinDTO, BinResponse } from './bin.types';
export declare class BinService {
    private readonly binRepository;
    private readonly aisleRepository;
    constructor(binRepository: BinRepository, aisleRepository: AisleRepository);
    create(dto: CreateBinDTO, userId: string): Promise<BinResponse>;
    findAll(): Promise<BinResponse[]>;
    findById(id: string): Promise<BinResponse>;
    findByAisleId(aisleId: string): Promise<BinResponse[]>;
    update(id: string, dto: UpdateBinDTO, userId: string): Promise<BinResponse>;
    delete(id: string, userId: string): Promise<void>;
    private toBinResponse;
}
//# sourceMappingURL=bin.service.d.ts.map