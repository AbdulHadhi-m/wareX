import { useParams } from 'react-router-dom';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorState } from '@/components/common/error-state';
import { AisleForm } from '../components/aisle-form';
import { useAisle, useUpdateAisle } from '../hooks/use-aisles';

export function EditAislePage() {
  const { id = '' } = useParams<{ id: string }>();
  const { data: aisle, isLoading, isError, error, refetch } = useAisle(id);
  const { mutate: updateAisle, isPending } = useUpdateAisle(id);

  if (isLoading) return <LoadingSpinner className="min-h-[50vh]" />;
  if (isError || !aisle) {
    return (
      <PageContainer>
        <ErrorState message={error?.message ?? 'Failed to load aisle'} onRetry={refetch} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title={`Edit Aisle: ${aisle.name}`} description="Modify aisle details." />
      <div className="max-w-2xl">
        <AisleForm defaultValues={aisle} isPending={isPending} onSubmit={updateAisle} />
      </div>
    </PageContainer>
  );
}
