import { Link } from 'react-router-dom';
import { ChevronRight, ArrowUpRight, TrendingUp } from 'lucide-react';
import { ROUTES } from '@/constants';

export function HeroSection() {
  return (
    <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden bg-white">
      {/* Background subtle mesh glow */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & CTA */}
          <div className="lg:col-span-6 max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight text-[#111827] leading-[1.12] mb-6 font-display">
              Warehouse Management, <span className="text-emerald-600">Reimagined</span> for Modern Logistics
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed mb-9 font-normal">
              Track every device with precision using IMEI and serial numbers, manage inventory across warehouse locations, assign pick tasks to workers, and ensure secure, conflict-free warehouse operations—all from one intelligent platform.
            </p>

            <Link to={ROUTES.AUTH.REGISTER}>
              <button className="bg-[#111827] text-white hover:bg-black text-base font-semibold px-7 py-3.5 rounded-full inline-flex items-center gap-2 shadow-lg shadow-gray-900/10 transition-all hover:scale-[1.02] active:scale-[0.98] group">
                Book a free demo
                <ChevronRight className="size-4 text-gray-300 group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
              </button>
            </Link>
          </div>

          {/* Right Column: Reference Graphics Mockup */}
          <div className="lg:col-span-6 relative lg:pl-4">
            <div className="relative w-full max-w-lg mx-auto">
              
              {/* TOP RIGHT FLOATING CARD: Revenue Pill */}
              <div className="absolute -top-6 -right-2 sm:-right-4 bg-white rounded-2xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.07)] border border-gray-100 flex items-center gap-3.5 z-30 animate-floating">
                <div className="size-11 rounded-xl bg-emerald-50 border border-emerald-100/80 flex items-center justify-center text-emerald-600 shadow-xs">
                  <ArrowUpRight className="size-6 stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-black text-gray-900 tracking-tight">₹370k</p>
                </div>
              </div>

              {/* MAIN ANALYTICS DASHBOARD CARD */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.06)] p-6 sm:p-7 relative z-10 overflow-hidden">
                
                {/* Header Metrics */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 tracking-tight">52k</span>
                    <span className="text-sm font-semibold text-gray-500">Orders</span>
                  </div>
                  <div className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-100">
                    <TrendingUp className="size-3.5 stroke-[2.5]" />
                    <span>30%</span>
                  </div>
                </div>

                {/* Spline Wave Line Chart (SVG) */}
                <div className="w-full h-36 mb-6 relative">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Fill Area */}
                    <path
                      d="M0,90 Q 60,85 110,65 T 220,70 T 320,25 T 400,20 L 400,120 L 0,120 Z"
                      fill="url(#emeraldGradient)"
                    />
                    {/* Stroke Line */}
                    <path
                      d="M0,90 Q 60,85 110,65 T 220,70 T 320,25 T 400,20"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* Bottom Sub-Panels */}
                <div className="grid grid-cols-12 gap-4 items-end pt-2 border-t border-gray-100/60">
                  {/* Left Skeleton UI elements */}
                  <div className="col-span-6 space-y-2.5">
                    <div className="h-4 bg-gray-100 rounded-md w-3/4" />
                    <div className="h-10 bg-gray-50 rounded-xl border border-gray-100 p-2 flex items-center justify-between">
                      <div className="w-12 h-2.5 bg-gray-200 rounded-full" />
                      <div className="size-4 rounded-full bg-emerald-100" />
                    </div>
                  </div>

                  {/* Right Mini Bar & Donut Panels */}
                  <div className="col-span-6 grid grid-cols-2 gap-3">
                    {/* Vertical Bar Chart */}
                    <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-3 flex items-end justify-between h-20">
                      <div className="w-2 bg-gray-200 rounded-t h-2/5" />
                      <div className="w-2 bg-gray-200 rounded-t h-3/5" />
                      <div className="w-2 bg-emerald-500 rounded-t h-4/5 shadow-xs" />
                      <div className="w-2 bg-gray-200 rounded-t h-1/2" />
                    </div>

                    {/* Donut Ring Module */}
                    <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-2.5 flex flex-col items-center justify-center relative">
                      <div className="relative size-14 flex items-center justify-center">
                        <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-gray-200"
                            strokeWidth="3.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-emerald-500"
                            strokeDasharray="75, 100"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">↗ 0.2%</span>
                          <span className="text-[11px] font-extrabold text-gray-900 leading-tight">71.2k</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-medium text-gray-400 mt-1">Total Items</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTTOM LEFT FLOATING CARD: Detailed 3D Isometric Warehouse Illustration */}
              <div className="absolute -bottom-10 -left-4 sm:-left-8 bg-white rounded-[28px] p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.12)] border border-gray-100/90 z-30 w-60 sm:w-64 transform transition-transform hover:scale-105 duration-300">
                <div className="w-full h-44 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Soft Mint Oval Base Shadow */}
                    <ellipse cx="110" cy="168" rx="68" ry="18" fill="#E6F9F3" />

                    {/* Warehouse Left Wall (Cool Grey/Lavender Tint) */}
                    <polygon points="48,107 110,142 110,87 48,52" fill="#E2E7EC" />
                    
                    {/* Warehouse Right Wall (Crisp Off-White) */}
                    <polygon points="110,142 172,107 172,52 110,87" fill="#EFF3F6" />

                    {/* Left Wall Slate Window */}
                    <polygon points="64,74 82,84 82,68 64,58" fill="#8A99AD" />

                    {/* Right Wall Shutter Door Frame */}
                    <polygon points="128,117 156,101 156,66 128,82" fill="#2D3748" />

                    {/* Rolling Shutter Horizontal Mint Stripes */}
                    <line x1="128" y1="94" x2="156" y2="78" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="128" y1="102" x2="156" y2="86" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="128" y1="110" x2="156" y2="94" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Roof Left Fascia / Overhang Edge */}
                    <polygon points="42,48 110,87 110,94 42,55" fill="#059669" />

                    {/* Roof Right Fascia / Overhang Edge */}
                    <polygon points="110,87 178,48 178,55 110,94" fill="#10B981" />

                    {/* Roof Flat Top Surface (True Isometric Rhombus - Emerald Mint Green) */}
                    <polygon points="42,48 110,9 178,48 110,87" fill="#00D084" />

                    {/* Stacked Isometric Cargo Boxes in Foreground */}

                    {/* Box 1: Bottom Left Box */}
                    <polygon points="30,120 44,128 58,120 44,112" fill="#6EE7B7" />
                    <polygon points="30,120 44,128 44,140 30,132" fill="#059669" />
                    <polygon points="44,128 58,120 58,132 44,140" fill="#10B981" />

                    {/* Box 2: Bottom Right Box */}
                    <polygon points="54,134 68,142 82,134 68,126" fill="#6EE7B7" />
                    <polygon points="54,134 68,142 68,154 54,146" fill="#059669" />
                    <polygon points="68,142 82,134 82,146 68,154" fill="#10B981" />

                    {/* Box 3: Top Stacked Box */}
                    <polygon points="42,110 56,118 70,110 56,102" fill="#A7F3D0" />
                    <polygon points="42,110 56,118 56,130 42,122" fill="#10B981" />
                    <polygon points="56,118 70,110 70,122 56,130" fill="#34D399" />
                  </svg>
                </div>
              </div>


            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

