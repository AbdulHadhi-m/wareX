import { Outlet } from 'react-router-dom';
import { AppLogo } from '@/components/common/app-logo';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <AppLogo />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
