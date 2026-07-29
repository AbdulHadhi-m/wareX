import { HeroNav } from '../components/hero-nav';
import { HeroSection } from '../components/hero-section';
import { TrustBar } from '../components/trust-bar';
import { FeaturesSection } from '../components/features-section';
import { HeroFooter } from '../components/hero-footer';

export function HeroPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <HeroNav />
      <HeroSection />
      <TrustBar />
      <FeaturesSection />
      <HeroFooter />
    </div>
  );
}
