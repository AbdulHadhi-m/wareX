import { IRole, CreateRoleDTO, UpdateRoleDTO } from './role.types';
export declare class RoleRepository {
    findAll(): Promise<IRole[]>;
    findById(id: string): Promise<IRole | null>;
    findByName(name: string): Promise<IRole | null>;
    create(data: CreateRoleDTO): Promise<IRole>;
    update(id: string, data: UpdateRoleDTO): Promise<IRole | null>;
    delete(id: string): Promise<IRole | null>;
    existsByName(name: string): Promise<boolean>;
    count(): Promise<number>;
}
//# sourceMappingURL=role.repository.d.ts.map