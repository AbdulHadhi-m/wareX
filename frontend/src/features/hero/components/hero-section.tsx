import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { ShaderBackground } from './shader-background';
import { ThreeScene } from './three-scene';
import { useMagneticEffect } from '../hooks/use-magnetic-effect';
import { useParallax } from '../hooks/use-parallax';

function KpiCard({ value, label, speed }: { value: string; label: string; speed: number }) {
  const ref = useParallax<HTMLDivElement>(speed);
  return (
    <div ref={ref}>
      <div className="text-[#006194] text-2xl md:text-[32px] font-bold tracking-tight text-shimmer">
        {value}
      </div>
      <div className="text-[#3f4850] text-[11px] uppercase tracking-widest font-bold">
        {label}
      </div>
    </div>
  );
}

export function HeroSection() {
  const getStartedRef = useMagneticEffect<HTMLDivElement>();
  const exploreRef = useMagneticEffect<HTMLDivElement>();

  return (
    <section className="relative pt-48 pb-24 px-4 sm:px-6 min-h-screen flex items-center overflow-hidden">
      <ShaderBackground />
      <ThreeScene />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(0,123,185,0.05)_0%,transparent_60%)] z-0 opacity-50 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10 w-full">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#006194]/5 border border-[#006194]/10 px-4 py-1.5 rounded-full text-[#006194] bg-gradient-to-r from-transparent via-[#006194]/5 to-transparent bg-[length:200%_100%] animate-shimmer">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span className="text-[11px] uppercase tracking-widest font-bold">v4.0 Autonomous Engine</span>
          </div>

          <h1 className="text-[56px] md:text-[84px] leading-[0.95] text-[#191c1e] tracking-tight font-bold">
            Intelligence <br />
            <span className="text-[#006194] italic font-medium">at Scale.</span>
          </h1>

          <p className="text-lg text-[#3f4850] max-w-xl leading-relaxed">
            The next-generation warehouse management system powered by real-time spatial intelligence
            and autonomous orchestration.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div ref={getStartedRef} className="inline-block transition-transform duration-300">
              <Link
                to={ROUTES.AUTH.REGISTER}
                className="inline-block bg-[#006194] text-white px-10 py-4 rounded-xl font-bold text-sm shadow-xl shadow-[#006194]/10 hover:shadow-[#006194]/20 transition-all active:scale-95"
              >
                Get Started Now
              </Link>
            </div>
            <div ref={exploreRef} className="inline-block transition-transform duration-300">
              <a
                href="#features"
                className="inline-block bg-white border border-[#bfc7d2] text-[#191c1e] px-10 py-4 rounded-xl font-bold text-sm hover:bg-[#f2f4f6] transition-all active:scale-95"
              >
                Explore Platform
              </a>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#bfc7d2]/30 mt-8">
            <KpiCard value="40%" label="Throughput" speed={0.1} />
            <KpiCard value="99.9%" label="Accuracy" speed={0.05} />
            <KpiCard value="<5ms" label="Latency" speed={0.15} />
          </div>
        </div>

        <div className="relative">
          <div className="relative z-10 rounded-2xl overflow-hidden bg-white/70 backdrop-blur-md border border-white/80 p-2 shadow-2xl animate-floating">
            <img
              alt="Autonomous Warehouse visualization"
              className="w-full aspect-[4/3] object-cover rounded-xl"
              src="https://lh3.googleusercontent.com/aida/AP1WRLtOPo1Wa2mACYtQJmyZ6dKcEkLX5THdICAeqvfPznspn-FhbjCn-a4q4bgGC0z4wS5ZE-OfXpH4cGz-hZnqWerB9GJdJ04m7ozsrqJpsCSkB9i0nUNnGD7s3rCYHKbqRG2UZwWBrGrcdN2SI0KDVLqxmHEy8SOAQE6kj_hw9xYxq51b7YoEsugqZBHIFjyWE2H55hodHtmJnrgfj062f37VS1CQGPQPayV92G8UZka6whK8MRM5DfFgwdl6"
            />
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 border border-[#bfc7d2]/30 rounded-lg animate-pulse-slow shadow-lg pointer-events-none">
              <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[#191c1e] text-[11px] font-bold tracking-wider uppercase">
                  Core Status: Optimal
                </span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-[#006194]/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -top-16 -right-16 w-80 h-80 bg-[#007bb9]/10 blur-[100px] rounded-full pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
