import { HeroNav } from '../components/hero-nav';
import { HeroSection } from '../components/hero-section';
import { BrandBar } from '../components/brand-bar';
import { FeaturesSection } from '../components/features-section';
import { ResultsSection } from '../components/results-section';
import { WhyChooseSection } from '../components/why-choose-section';
import { CTASection } from '../components/cta-section';
import { HeroFooter } from '../components/hero-footer';

export function HeroPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroNav />
      <HeroSection />
      <BrandBar />
      <FeaturesSection />
      <ResultsSection />
      <WhyChooseSection />
      <CTASection />
      <HeroFooter />
    </div>
  );
}
