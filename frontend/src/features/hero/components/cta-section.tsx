import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { ArrowRight, ShieldCheck, RefreshCw, Layers } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[32px] bg-[#111827] text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl shadow-gray-900/20">
          
          {/* Subtle background ambient mesh glow */}
          <div className="absolute -top-24 -right-24 size-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-4 py-1.5 rounded-full text-emerald-400 text-xs font-bold tracking-wide mb-6">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Internal Warehouse Platform
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight font-display">
              Streamline your internal warehouse operations with <span className="text-emerald-400">wareX</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-300 mb-10 max-w-xl mx-auto font-normal leading-relaxed">
              Organize physical bin locations, track device serial numbers, assign worker pick lists, and maintain full audit control from one single platform.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link to={ROUTES.AUTH.LOGIN}>
                <button className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-3.5 rounded-full text-base inline-flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]">
                  Sign In to Dashboard
                  <ArrowRight className="size-4 stroke-[3]" />
                </button>
              </Link>
              <Link to={ROUTES.AUTH.REGISTER}>
                <button className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white font-semibold px-8 py-3.5 rounded-full text-base border border-white/20 inline-flex items-center justify-center gap-2 transition-all">
                  Create Account
                </button>
              </Link>
            </div>

            {/* Key System Highlights */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-400 font-medium">
              <div className="flex items-center justify-center gap-2">
                <Layers className="size-4 text-emerald-400" />
                <span>Zone → Aisle → Bin Tracking</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <RefreshCw className="size-4 text-emerald-400" />
                <span>Full Transfer Audit History</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="size-4 text-emerald-400" />
                <span>SuperAdmin / Manager / Worker RBAC</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}



