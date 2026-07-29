import { useParams } from 'react-router-dom';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorState } from '@/components/common/error-state';
import { BinForm } from '../components/bin-form';
import { useBin, useUpdateBin } from '../hooks/use-bins';
import type { CreateBinFormData } from '../schemas/bin-schema';

export function EditBinPage() {
  const { id } = useParams<{ id: string }>();
  const { data: bin, isLoading, isError, error, refetch } = useBin(id!);
  const updateMutation = useUpdateBin(id!);

  const handleSubmit = (data: CreateBinFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingSpinner size="lg" className="py-16" />
      </PageContainer>
    );
  }

  if (isError || !bin) {
    return (
      <PageContainer>
        <ErrorState
          title="Bin not found"
          message={error?.message ?? 'Unable to load bin details.'}
          onRetry={() => refetch()}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { label: 'Bins', href: '/dashboard/bins' },
          { label: bin.name, href: `/dashboard/bins/${bin.id}` },
          { label: 'Edit' },
        ]}
      />
      <PageHeader
        title={`Edit: ${bin.name}`}
        description="Update bin information."
      />
      <BinForm
        defaultValues={bin}
        isPending={updateMutation.isPending}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}
