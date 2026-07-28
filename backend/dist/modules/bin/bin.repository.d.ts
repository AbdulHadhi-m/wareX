import { IBin, CreateBinDTO, UpdateBinDTO } from './bin.types';
export declare class BinRepository {
    private baseFilter;
    findAll(): Promise<IBin[]>;
    findById(id: string): Promise<IBin | null>;
    findByAisleId(aisleId: string): Promise<IBin[]>;
    findByCodeInAisle(code: string, aisleId: string): Promise<IBin | null>;
    findByCodeInAisleExcludingId(code: string, aisleId: string, excludeId: string): Promise<IBin | null>;
    create(data: CreateBinDTO & {
        createdBy: string;
        updatedBy: string;
    }): Promise<IBin>;
    update(id: string, data: UpdateBinDTO & {
        updatedBy: string;
    }): Promise<IBin | null>;
    softDelete(id: string, updatedBy: string): Promise<IBin | null>;
}
//# sourceMappingURL=bin.repository.d.ts.map