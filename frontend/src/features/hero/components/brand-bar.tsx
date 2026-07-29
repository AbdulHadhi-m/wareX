const brands = [
  'Being Human', 'JioMart', 'Puma', 'ASOS', 'Superdry',
  'West Elm', 'Kalyan Silks', 'The Sleep Company', 'Mi Arcus', 'Low Cost Glasses',
];

export function BrandBar() {
  return (
    <section className="py-12 border-y border-gray-100 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.25em] text-gray-400 mb-8">
          Trusted by
        </p>
        
        {/* Infinite Moving Marquee Wrapper with Side Fade Gradients */}
        <div className="relative w-full overflow-hidden">
          {/* Left Fade Overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          
          {/* Right Fade Overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Marquee Track */}
          <div className="animate-marquee flex items-center gap-12 sm:gap-16 py-2">
            {/* First Set of Brands */}
            {brands.map((brand, idx) => (
              <span
                key={`b1-${idx}`}
                className="text-base sm:text-lg font-extrabold text-gray-300 hover:text-emerald-600 transition-colors tracking-tight whitespace-nowrap cursor-pointer select-none"
              >
                {brand}
              </span>
            ))}
            {/* Duplicated Second Set for Seamless Infinite Loop */}
            {brands.map((brand, idx) => (
              <span
                key={`b2-${idx}`}
                className="text-base sm:text-lg font-extrabold text-gray-300 hover:text-emerald-600 transition-colors tracking-tight whitespace-nowrap cursor-pointer select-none"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

