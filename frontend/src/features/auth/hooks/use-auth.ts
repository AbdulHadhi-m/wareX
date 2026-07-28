import { useAuthStore } from '../store/auth-store';
import { authService } from '../services/auth-service';

export function useAuth() {
  const store = useAuthStore();

  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    initialized: store.initialized,
    role: store.user?.role ?? null,
  };
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return () => {
    authService.removeToken();
    clearAuth();
  };
}
