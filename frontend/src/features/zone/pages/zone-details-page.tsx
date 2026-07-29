import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { PageContainer } from '@/components/common/page-container';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorState } from '@/components/common/error-state';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { ZoneInfoCard } from '../components/zone-info-card';
import { useZone, useDeleteZone } from '../hooks/use-zones';

export function ZoneDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: zone, isLoading, isError, error, refetch } = useZone(id!);
  const deleteMutation = useDeleteZone();
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = () => {
    deleteMutation.mutate(zone!.id, {
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

  if (isError || !zone) {
    return (
      <PageContainer>
        <ErrorState
          title="Zone not found"
          message={error?.message ?? 'Unable to load zone details.'}
          onRetry={() => refetch()}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { label: 'Zones', href: '/dashboard/zones' },
          { label: zone.name },
        ]}
      />
      <ZoneInfoCard
        zone={zone}
        onDelete={() => setShowDelete(true)}
        isDeleting={deleteMutation.isPending}
      />

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Zone"
        message={`Are you sure you want to delete "${zone.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </PageContainer>
  );
}
