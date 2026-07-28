import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type { AuthResponse, LoginCredentials, MeResponse } from '../types';

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', credentials),

  me: () =>
    api.get<ApiResponse<MeResponse>>('/auth/me'),
};
