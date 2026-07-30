export interface AdminUserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  roleId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  roleId?: string;
  role?: string;
  isActive?: boolean;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  roleId?: string;
  role?: string;
  isActive?: boolean;
}

export interface UserListParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  roleId?: string;
  role?: string;
  isActive?: boolean;
}
