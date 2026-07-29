import { LoginForm } from '../components/login-form';
import { Link } from 'react-router-dom';

export function LoginPage() {
  return (
    <div className="bg-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
      {/* Top Header inside Card with Grid Pattern */}
      <div className="bg-[#F8F9FD] py-8 px-6 border-b border-gray-100/90 text-center relative overflow-hidden">
        {/* Subtle SVG Grid Tile Overlay */}
        <svg className="absolute inset-0 size-full opacity-[0.45]" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="authGrid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#E2E8F0" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#authGrid)" />
        </svg>

        {/* Logo emblem card */}
        <Link to="/" className="relative z-10 inline-block group mb-3.5">
          <div className="size-[54px] rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center mx-auto transition-transform group-hover:scale-105">
            <svg className="size-6 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        </Link>

        <h1 className="relative z-10 text-[26px] font-bold text-gray-900 tracking-tight leading-tight">Sign In</h1>
        <p className="relative z-10 text-xs font-semibold text-gray-400 mt-1">To continue to wareX</p>
      </div>

      {/* Card Body Form */}
      <div className="p-7 sm:p-8">
        <LoginForm />
      </div>
    </div>
  );
}



