import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ROUTES } from '@/constants';
import { useAuth } from '../hooks/use-auth';

interface GuestRouteProps {
  children: ReactNode;
}

export function GuestRoute({ children }: GuestRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" label="Authenticating..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
}
