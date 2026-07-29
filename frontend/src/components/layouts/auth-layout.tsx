import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F4F6F8] px-4 py-8 font-sans">
      <div className="w-full max-w-[440px] mx-auto">
        <Outlet />
      </div>
    </div>
  );
}


