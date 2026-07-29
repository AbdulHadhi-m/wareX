import { PermissionRepository } from './permission.repository';
import { CreatePermissionDTO, UpdatePermissionDTO, PermissionResponse } from './permission.types';
export declare class PermissionService {
    private readonly repository;
    constructor(repository: PermissionRepository);
    findAll(): Promise<PermissionResponse[]>;
    findByModule(module: string): Promise<PermissionResponse[]>;
    findById(id: string): Promise<PermissionResponse>;
    create(dto: CreatePermissionDTO): Promise<PermissionResponse>;
    update(id: string, dto: UpdatePermissionDTO): Promise<PermissionResponse>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=permission.service.d.ts.map