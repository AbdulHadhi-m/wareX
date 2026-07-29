export function TrustBar() {
  const logos = [
    { icon: 'hub', name: 'LOGITECH' },
    { icon: 'public', name: 'GLOBAL SHIP' },
    { icon: 'precision_manufacturing', name: 'AUTOSTORE' },
    { icon: 'terminal', name: 'NEXUS CORE' },
  ];

  return (
    <section className="py-16 bg-white border-y border-[#bfc7d2]/20 relative z-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <p className="text-center text-[11px] text-[#707881] mb-10 uppercase tracking-[0.4em] font-bold">
          Trusted by Global Infrastructure Leaders
        </p>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {logos.map((logo) => (
            <span
              key={logo.name}
              className="text-2xl text-[#191c1e] tracking-tighter flex items-center gap-2 font-bold"
            >
              <span className="material-symbols-outlined text-[#006194] text-[28px]">{logo.icon}</span>
              {logo.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
