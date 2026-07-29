import { PackageCheck, Target, Timer, Gauge, ShieldCheck } from 'lucide-react';

const results = [
  { icon: PackageCheck, value: '1Mn+', label: 'orders per day' },
  { icon: Target, value: '99.7%', label: 'inventory accuracy' },
  { icon: Timer, value: '<30 secs', label: 'order processing time' },
  { icon: Gauge, value: '98%', label: 'OTIF (On-time in-full)' },
  { icon: ShieldCheck, value: '100%', label: 'uptime' },
];

export function ResultsSection() {
  return (
    <section className="py-20 bg-[#111827] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-white">
            Results & scale you can trust
          </h2>
        </div>

        {/* Simple 5-Column Stats Row (No Boxes) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {results.map((r) => (
            <div key={r.label} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400">
                  <r.icon className="size-6 stroke-[2.2]" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1.5">
                {r.value}
              </div>
              <div className="text-sm text-gray-400 font-normal">
                {r.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}


