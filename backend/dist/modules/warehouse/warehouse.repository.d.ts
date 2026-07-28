import { IWarehouse, CreateWarehouseDTO, UpdateWarehouseDTO } from './warehouse.types';
export declare class WarehouseRepository {
    private baseFilter;
    findAll(): Promise<IWarehouse[]>;
    findById(id: string): Promise<IWarehouse | null>;
    findByCode(code: string): Promise<IWarehouse | null>;
    findByCodeExcludingId(code: string, excludeId: string): Promise<IWarehouse | null>;
    create(data: CreateWarehouseDTO & {
        createdBy: string;
        updatedBy: string;
    }): Promise<IWarehouse>;
    update(id: string, data: UpdateWarehouseDTO & {
        updatedBy: string;
    }): Promise<IWarehouse | null>;
    softDelete(id: string, updatedBy: string): Promise<IWarehouse | null>;
}
//# sourceMappingURL=warehouse.repository.d.ts.map