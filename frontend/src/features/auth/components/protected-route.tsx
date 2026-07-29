import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { useAuth } from '../hooks/use-auth';
import type { UserRole } from '../types';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: UserRole[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" label="Authenticating..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (roles && user && user.role !== 'SuperAdmin' && !roles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
}
