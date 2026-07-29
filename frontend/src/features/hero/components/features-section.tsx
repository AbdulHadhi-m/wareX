import { useScrollReveal } from '../hooks/use-scroll-reveal';

const features = [
  {
    icon: 'psychology',
    title: 'Autonomous Orchestration',
    desc: 'AI-driven routing that predicts bottlenecks before they happen, adjusting workflows in real-time for peak efficiency.',
  },
  {
    icon: 'visibility',
    title: 'Real-time Visibility',
    desc: 'Every single asset and robotic node tracked with millisecond precision across your entire facility network.',
  },
  {
    icon: 'electrical_services',
    title: 'Seamless Integration',
    desc: 'Deep-level connectivity that plugs directly into your existing ERP and IoT stack without downtime or friction.',
  },
];

function FeatureCard({ icon, title, desc, index }: { icon: string; title: string; desc: string; index: number }) {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="opacity-0 translate-y-12 bg-white/70 backdrop-blur-md border border-white/80 p-8 rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] transition-all duration-700 group hover:-translate-y-2 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,123,185,0.15)] hover:border-[#007bb9]/30"
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="size-16 rounded-2xl bg-[#006194]/5 border border-[#006194]/10 flex items-center justify-center mb-6 group-hover:bg-[#006194]/10 transition-colors">
        <span className="material-symbols-outlined text-[36px] text-[#006194]">{icon}</span>
      </div>
      <h3 className="text-2xl font-semibold text-[#191c1e] mb-3 tracking-tight">{title}</h3>
      <p className="text-base text-[#3f4850] leading-relaxed">{desc}</p>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 max-w-[1440px] mx-auto relative z-20">
      <div className="text-center mb-16">
        <div className="inline-block text-[#006194] font-bold text-[11px] uppercase tracking-[0.3em] mb-4">
          Core Capabilities
        </div>
        <h2 className="text-[42px] text-[#191c1e] mb-4 tracking-tight font-bold">
          The wareX Intelligence Engine
        </h2>
        <p className="text-base text-[#3f4850] max-w-2xl mx-auto leading-relaxed">
          Advanced spatial awareness and machine learning algorithms working in tandem to redefine
          industrial throughput.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <FeatureCard key={f.title} {...f} index={i} />
        ))}
      </div>
    </section>
  );
}
