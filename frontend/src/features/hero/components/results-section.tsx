import { Scan, Target, Layers, Timer, ShieldCheck } from 'lucide-react';

const results = [
  { icon: Scan, value: '100%', label: 'Serial / IMEI device tracking' },
  { icon: Target, value: '99.9%', label: 'Bin location accuracy' },
  { icon: Layers, value: '3-Tier', label: 'Zone → Aisle → Bin structure' },
  { icon: Timer, value: '<15 secs', label: 'Worker pick list dispatch' },
  { icon: ShieldCheck, value: '100%', label: 'Audit trail history logging' },
];

export function ResultsSection() {
  return (
    <section id="metrics" className="py-20 lg:py-24 bg-[#111827] text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-emerald-400 text-xs font-bold tracking-wide mb-4">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live System Performance
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display">
            Internal Warehouse <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Metrics & Precision</span>
          </h2>
        </div>

        {/* 5-Column Stats Row with Premium Typography */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-10">
          {results.map((r) => (
            <div key={r.label} className="text-center group">
              <div className="flex justify-center mb-5">
                <div className="size-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                  <r.icon className="size-6 stroke-[2.2]" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-2 font-display drop-shadow-xs">
                {r.value}
              </div>
              <div className="text-xs sm:text-sm text-emerald-100/70 font-semibold leading-relaxed tracking-wide max-w-[170px] mx-auto">
                {r.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}



