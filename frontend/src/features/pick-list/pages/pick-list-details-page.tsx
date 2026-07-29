import { useParams } from 'react-router-dom';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { PageContainer } from '@/components/common/page-container';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorState } from '@/components/common/error-state';
import { PickListInfoCard } from '../components/pick-list-info-card';
import { PickListDevicesTable } from '../components/pick-list-devices-table';
import { usePickList } from '../hooks/use-pick-lists';

export function PickListDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: pickList, isLoading, isError, error, refetch } = usePickList(id!);

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingSpinner size="lg" className="py-16" />
      </PageContainer>
    );
  }

  if (isError || !pickList) {
    return (
      <PageContainer>
        <ErrorState
          title="Pick list not found"
          message={error?.message ?? 'Unable to load pick list details.'}
          onRetry={() => refetch()}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { label: 'Pick Lists', href: '/dashboard/pick-lists' },
          { label: pickList.pickListNumber },
        ]}
      />
      <PickListInfoCard pickList={pickList} />
      <div className="mt-6">
        <PickListDevicesTable deviceIds={pickList.deviceIds} />
      </div>
    </PageContainer>
  );
}
