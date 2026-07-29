import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { ROUTES } from '@/constants';
import { loginSchema, type LoginFormData } from '../schemas/login-schema';
import { useLogin } from '../hooks/use-login';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const isPending = loginMutation.isPending;

  return (
    <form onSubmit={handleSubmit((data) => loginMutation.mutate(data))} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-xs font-bold text-gray-700">
          Email ID<span className="text-red-500 ml-0.5">*</span>
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter Email ID"
          autoComplete="email"
          disabled={isPending}
          className="w-full h-11 px-4 rounded-xl border border-gray-200/90 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs font-medium text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-xs font-bold text-gray-700">
            Password<span className="text-red-500 ml-0.5">*</span>
          </label>
          <a href="#" className="text-xs font-semibold text-emerald-600 hover:underline">
            Forgot Password?
          </a>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter Password"
            autoComplete="current-password"
            disabled={isPending}
            className="w-full h-11 px-4 pr-10 rounded-xl border border-gray-200/90 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs font-medium text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full h-11 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md shadow-emerald-600/20 inline-flex items-center justify-center disabled:opacity-50 mt-2"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </button>

      <p className="text-center text-xs font-medium text-gray-500 pt-3">
        Don&apos;t have an account?{' '}
        <Link to={ROUTES.AUTH.REGISTER} className="font-bold text-emerald-600 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}






