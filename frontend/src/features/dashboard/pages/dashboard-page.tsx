import { PageContainer } from '@/components/common/page-container';
import { WelcomeSection } from '../components/welcome-section';
import { SummaryCardsGrid } from '../components/summary-cards-grid';
import { ChartsSection } from '../components/charts-section';
import { RecentActivity } from '../components/recent-activity';
import { QuickActions } from '../components/quick-actions';

export function DashboardPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <WelcomeSection />
        <SummaryCardsGrid />
        <ChartsSection />
        <RecentActivity />
        <QuickActions />
      </div>
    </PageContainer>
  );
}
