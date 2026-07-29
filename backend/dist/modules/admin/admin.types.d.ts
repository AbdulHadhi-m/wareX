export interface AdminUserResponse {
    id: string;
    name: string;
    email: string;
    role: string;
    roleId: string;
    createdAt: string;
    updatedAt: string;
}
export interface UpdateUserData {
    name?: string;
    email?: string;
    password?: string;
    roleId?: string;
}
export interface CreateUserData {
    name: string;
    email: string;
    password: string;
    roleId: string;
}
export interface UserListParams {
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    roleId?: string;
}
//# sourceMappingURL=admin.types.d.ts.map