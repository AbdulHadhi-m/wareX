import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth-api';
import { authService } from '../services/auth-service';
import { useAuthStore } from '../store/auth-store';

export function useRegister() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: ({
      name,
      email,
      password,
      role,
    }: {
      name: string;
      email: string;
      password: string;
      role: 'Manager' | 'Worker';
    }) => authApi.register({ name, email, password, role }).then((res) => res.data.data!),

    onSuccess: (data) => {
      const { token, user } = data;
      authService.setToken(token);
      setAuth(user, token);
      toast.success(`Account created. Welcome, ${user.name}!`);
      navigate('/', { replace: true });
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
