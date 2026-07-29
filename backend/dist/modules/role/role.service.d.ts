import { RoleRepository } from './role.repository';
import { CreateRoleDTO, UpdateRoleDTO, RoleResponse } from './role.types';
export declare class RoleService {
    private readonly repository;
    constructor(repository: RoleRepository);
    findAll(): Promise<RoleResponse[]>;
    findById(id: string): Promise<RoleResponse>;
    create(dto: CreateRoleDTO): Promise<RoleResponse>;
    update(id: string, dto: UpdateRoleDTO): Promise<RoleResponse>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=role.service.d.ts.map