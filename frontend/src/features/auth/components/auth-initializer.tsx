import { useEffect } from 'react';
import { authApi } from '../api/auth-api';
import { authService } from '../services/auth-service';
import { useAuthStore } from '../store/auth-store';

export function AuthInitializer() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  useEffect(() => {
    const token = authService.getToken();

    if (!token) {
      setInitialized();
      return;
    }

    authApi
      .me()
      .then((res) => {
        setAuth(res.data.data!.user, token);
      })
      .catch(() => {
        authService.removeToken();
        clearAuth();
      })
      .finally(() => {
        setInitialized();
      });
  }, [setAuth, clearAuth, setInitialized]);

  return null;
}
