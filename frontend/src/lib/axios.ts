import axios from 'axios';
import { env } from '@/config/env';
import { authService } from '@/features/auth/services/auth-service';
import { useAuthStore } from '@/features/auth/store/auth-store';

export const api = axios.create({
  baseURL: env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = authService.getToken();
      if (token && !error.config?.url?.includes('/auth/login')) {
        authService.removeToken();
        useAuthStore.getState().clearAuth();
      }
    }
    return Promise.reject(error);
  },
);
