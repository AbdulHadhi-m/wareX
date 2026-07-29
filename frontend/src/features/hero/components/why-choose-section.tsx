import { MapPin, ShieldCheck, History, Users, Cpu, LineChart } from 'lucide-react';

const benefits = [
  {
    icon: MapPin,
    title: 'Pinpoint Bin Precision',
    desc: 'Never lose a device. Track hardware down to the exact Zone, Aisle, and Bin location in real time.',
  },
  {
    icon: ShieldCheck,
    title: 'IMEI & Serial Traceability',
    desc: 'Register every item with unique serial/IMEI identifiers for zero-loss asset accountability.',
  },
  {
    icon: History,
    title: 'Complete Audit Trail',
    desc: 'Every item movement between bins is logged with timestamps and user details for complete transparency.',
  },
  {
    icon: Users,
    title: 'Role-Scoped Access Control',
    desc: 'Dedicated interfaces for SuperAdmin (control), Manager (operations), and Worker (task execution).',
  },
  {
    icon: Cpu,
    title: 'Internal Tool Architecture',
    desc: 'Custom-tailored specifically for your internal warehouse workflows—not a bloated SaaS product.',
  },
  {
    icon: LineChart,
    title: 'Live Operational Reports',
    desc: 'Monitor bin occupancy, pick list fulfillment speed, and inventory counts from live dashboard widgets.',
  },
];

export function WhyChooseSection() {
  return (
    <section id="why-choose" className="py-20 lg:py-28 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full text-emerald-700 text-xs font-bold tracking-wide mb-4">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Operational Advantages
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-display">
            Why teams rely on wareX WMS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((b) => (
            <div key={b.title} className="bg-white rounded-2xl border border-gray-100 p-7 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-200">
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-5">
                <b.icon className="size-5 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 font-display">{b.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-normal">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


