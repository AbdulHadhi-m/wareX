import { WarehouseRepository } from './warehouse.repository';
import { CreateWarehouseDTO, UpdateWarehouseDTO, WarehouseResponse } from './warehouse.types';
export declare class WarehouseService {
    private readonly repository;
    constructor(repository: WarehouseRepository);
    create(dto: CreateWarehouseDTO, userId: string): Promise<WarehouseResponse>;
    findAll(): Promise<WarehouseResponse[]>;
    findById(id: string): Promise<WarehouseResponse>;
    update(id: string, dto: UpdateWarehouseDTO, userId: string): Promise<WarehouseResponse>;
    delete(id: string, userId: string): Promise<void>;
    private toWarehouseResponse;
}
//# sourceMappingURL=warehouse.service.d.ts.map