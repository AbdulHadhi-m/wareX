import {
  Layers, PackageSearch, Scan, Warehouse, RefreshCw, ClipboardCheck, AlertTriangle, RotateCcw
} from 'lucide-react';

const features = [
  {
    icon: Layers,
    title: 'Multi-channel inventory management',
    desc: 'Keep stock in sync across marketplaces and D2C storefronts so you don\'t oversell or stock out.',
  },
  {
    icon: PackageSearch,
    title: 'Pick, pack and dispatch under 30 sec',
    desc: 'Move orders from confirmation to label on one screen, so you ship faster and hit SLAs consistently.',
  },
  {
    icon: Warehouse,
    title: 'Control tower (multi-warehouse visibility)',
    desc: 'Monitor picking, packing, receiving, and returns in real time from a central dashboard.',
  },
  {
    icon: RefreshCw,
    title: 'AI based Predictive expiry engine (FIFO/FEFO)',
    desc: 'Auto tracks batches and expiries across warehouses, flags near-expiry lots, and prioritises FEFO.',
  },
  {
    icon: Scan,
    title: 'Scan with handheld terminals',
    desc: 'Go paperless with handheld barcode scanning across receiving, picking, packing, and putaway.',
  },
  {
    icon: ClipboardCheck,
    title: 'Bin-level inventory traceability',
    desc: 'Track every SKU\'s exact bin location with serialised/non-serialised item tracking.',
  },
  {
    icon: RotateCcw,
    title: 'Returns management with reverse QC',
    desc: 'Process returns with reverse QC to separate saleable from damaged, so you restock faster.',
  },
  {
    icon: AlertTriangle,
    title: 'Exception handling',
    desc: 'Central exception task list for stock audits, QC rejections, and cancellations.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full text-emerald-700 text-xs font-bold tracking-wide mb-4">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Core Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Features to solve your warehousing challenges
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="group p-6 rounded-2xl border border-gray-100 bg-white hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300">
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-5 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <feature.icon className="size-5 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-normal">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

