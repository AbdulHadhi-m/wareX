import { LayoutGrid, HeadphonesIcon, PlugZap, BarChart3, Zap, RefreshCw } from 'lucide-react';

const benefits = [
  {
    icon: LayoutGrid,
    title: 'Unified platform',
    desc: 'Centralized multi-channel orders fulfilment directly from a single platform.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Priority support',
    desc: 'Best in industry support with defined SLAs and escalation matrix.',
  },
  {
    icon: PlugZap,
    title: 'Rapid integrations',
    desc: 'Hassle-free integrations with all your existing ERP, POS, OMS, and delivery partners.',
  },
  {
    icon: BarChart3,
    title: 'Detailed analytics and reporting',
    desc: 'In-depth insights & custom reports for proactive decision-making.',
  },
  {
    icon: Zap,
    title: 'Operational efficiency',
    desc: 'Fast order fulfillments, high inventory accuracy, and customizable workflows.',
  },
  {
    icon: RefreshCw,
    title: 'AI-led replenishment',
    desc: 'Auto-trigger PO and transfer suggestions to prevent stockouts and lost orders.',
  },
];

export function WhyChooseSection() {
  return (
    <section className="py-20 lg:py-28 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full text-emerald-700 text-xs font-bold tracking-wide mb-4">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Why wareX
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Why leading brands choose wareX WMS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((b) => (
            <div key={b.title} className="bg-white rounded-2xl border border-gray-100 p-7 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-200">
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-5">
                <b.icon className="size-5 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{b.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-normal">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

