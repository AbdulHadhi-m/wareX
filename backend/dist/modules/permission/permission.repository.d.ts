import { IPermission, CreatePermissionDTO, UpdatePermissionDTO } from './permission.types';
export declare class PermissionRepository {
    findAll(): Promise<IPermission[]>;
    findByModule(module: string): Promise<IPermission[]>;
    findById(id: string): Promise<IPermission | null>;
    findByCode(code: string): Promise<IPermission | null>;
    create(data: CreatePermissionDTO): Promise<IPermission>;
    update(id: string, data: UpdatePermissionDTO): Promise<IPermission | null>;
    delete(id: string): Promise<IPermission | null>;
    existsByCode(code: string): Promise<boolean>;
    findByCodes(codes: string[]): Promise<IPermission[]>;
}
//# sourceMappingURL=permission.repository.d.ts.map