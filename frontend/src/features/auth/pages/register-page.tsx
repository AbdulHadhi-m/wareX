import { RegisterForm } from '../components/register-form';
import { Link } from 'react-router-dom';

export function RegisterPage() {
  return (
    <div className="bg-white rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
      {/* Top Header inside Card with Grid Pattern */}
      <div className="bg-[#FAFAFD] p-8 border-b border-gray-100/80 text-center relative overflow-hidden">
        {/* Subtle SVG Grid Overlay */}
        <svg className="absolute inset-0 size-full opacity-[0.35]" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#E2E8F0" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Logo emblem */}
        <Link to="/" className="relative z-10 inline-block group mb-3">
          <div className="size-14 rounded-2xl bg-white border border-gray-100 shadow-md flex items-center justify-center mx-auto transition-transform group-hover:scale-105">
            <svg className="size-7 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        </Link>

        <h1 className="relative z-10 text-2xl font-bold text-gray-900 tracking-tight">Create Account</h1>
        <p className="relative z-10 text-xs font-semibold text-gray-400 mt-1">Get started with wareX</p>
      </div>

      {/* Card Body Form */}
      <div className="p-7 sm:p-8">
        <RegisterForm />
      </div>
    </div>
  );
}


