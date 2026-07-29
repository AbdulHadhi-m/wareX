import {
  Layers, Scan, RefreshCw, ClipboardList, ShieldCheck, BarChart3
} from 'lucide-react';

const features = [
  {
    icon: Layers,
    title: 'Physical location hierarchy (Zones → Aisles → Bins)',
    desc: 'Structure your physical warehouse into Zones, Aisles, and Bins for precise item placement.',
  },
  {
    icon: Scan,
    title: 'Device tracking by Serial Number / IMEI',
    desc: 'Register hardware devices individually by IMEI or serial number and track their exact bin location.',
  },
  {
    icon: RefreshCw,
    title: 'Bin-to-bin transfers with full audit trail',
    desc: 'Move inventory between bins seamlessly while logging every transfer with timestamped audit history.',
  },
  {
    icon: ClipboardList,
    title: 'Order fulfillment & worker pick lists',
    desc: 'Create fulfillment orders and automatically generate itemized pick lists for warehouse workers.',
  },
  {
    icon: ShieldCheck,
    title: 'Three-tier role control (SuperAdmin, Manager, Worker)',
    desc: 'SuperAdmins manage system control, Managers oversee operations, and Workers execute picking tasks.',
  },
  {
    icon: BarChart3,
    title: 'Operational dashboard & inventory reports',
    desc: 'View live bin utilization, device counts, order statuses, and audit activity from a central dashboard.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full text-emerald-700 text-xs font-bold tracking-wide mb-4">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Core System Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight font-display">
            Built for precise, internal warehouse operations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="group p-7 rounded-2xl border border-gray-100 bg-white hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300">
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-5 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <feature.icon className="size-5 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug font-display">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-normal">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


