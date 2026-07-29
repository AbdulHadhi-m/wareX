import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorState } from '@/components/common/error-state';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { AisleInfoCard } from '../components/aisle-info-card';
import { useAisle, useDeleteAisle } from '../hooks/use-aisles';

export function AisleDetailsPage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: aisle, isLoading, isError, error, refetch } = useAisle(id);
  const deleteMutation = useDeleteAisle();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        navigate('/dashboard/aisles');
      },
    });
  };

  if (isLoading) return <LoadingSpinner className="min-h-[50vh]" />;
  if (isError || !aisle) {
    return (
      <PageContainer>
        <ErrorState message={error?.message ?? 'Failed to load aisle details'} onRetry={refetch} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title={aisle.name} description={`Code: ${aisle.code}`} />
      <AisleInfoCard
        aisle={aisle}
        onDelete={() => setShowDeleteConfirm(true)}
        isDeleting={deleteMutation.isPending}
      />
      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Aisle"
        message={`Are you sure you want to delete "${aisle.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </PageContainer>
  );
}
