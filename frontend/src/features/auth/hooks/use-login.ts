import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { authApi } from '../api/auth-api';
import { authService } from '../services/auth-service';
import { useAuthStore } from '../store/auth-store';

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login({ email, password }).then((res) => res.data.data!),

    onSuccess: (data) => {
      const { token, user } = data;
      authService.setToken(token);
      setAuth(user, token);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(ROUTES.DASHBOARD, { replace: true });
    },

    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { error?: { message?: string } } } };
      const message =
        axiosError?.response?.data?.error?.message ||
        'Unable to connect. Please check your connection and try again.';
      toast.error(message);
    },
  });
}
