import { Construction } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { PageContainer } from '@/components/common/page-container';

interface ComingSoonPageProps {
  title: string;
  description?: string;
}

export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <PageContainer>
      <PageHeader title={title} description={description} />
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-muted">
          <Construction className="size-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Coming Soon</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          This module is under development and will be available in a future release.
        </p>
      </div>
    </PageContainer>
  );
}
