import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { PageContainer } from '@/components/common/page-container';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorState } from '@/components/common/error-state';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { BinInfoCard } from '../components/bin-info-card';
import { useBin, useDeleteBin } from '../hooks/use-bins';

export function BinDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: bin, isLoading, isError, error, refetch } = useBin(id!);
  const deleteMutation = useDeleteBin();
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = () => {
    deleteMutation.mutate(bin!.id, {
      onSuccess: () => setShowDelete(false),
    });
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
          { label: bin.name },
        ]}
      />
      <BinInfoCard
        bin={bin}
        onDelete={() => setShowDelete(true)}
        isDeleting={deleteMutation.isPending}
      />

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Bin"
        message={`Are you sure you want to delete "${bin.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </PageContainer>
  );
}
