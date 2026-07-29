import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type { AuthResponse, LoginCredentials, MeResponse, RegisterData } from '../types';

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', credentials),

  register: (data: RegisterData) =>
    api.post<ApiResponse<AuthResponse>>('/auth/register', data),

  me: () =>
    api.get<ApiResponse<MeResponse>>('/auth/me'),
};
