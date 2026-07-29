import { AdminRepository } from './admin.repository';
import type { PaginationMeta } from '../../shared/types/api-response';
import type { AdminUserResponse, CreateUserData, UpdateUserData, UserListParams } from './admin.types';
export declare class AdminService {
    private readonly repository;
    constructor(repository: AdminRepository);
    list(params: UserListParams): Promise<{
        data: AdminUserResponse[];
        meta: PaginationMeta;
    }>;
    getById(id: string): Promise<AdminUserResponse>;
    create(dto: CreateUserData): Promise<AdminUserResponse>;
    update(id: string, dto: UpdateUserData): Promise<AdminUserResponse>;
    delete(id: string): Promise<void>;
    private toResponse;
}
//# sourceMappingURL=admin.service.d.ts.map