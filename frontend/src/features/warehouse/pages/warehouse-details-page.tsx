import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { PageContainer } from '@/components/common/page-container';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorState } from '@/components/common/error-state';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { WarehouseInfoCard } from '../components/warehouse-info-card';
import { useWarehouse, useDeleteWarehouse } from '../hooks/use-warehouses';

export function WarehouseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: warehouse, isLoading, isError, error, refetch } = useWarehouse(id!);
  const deleteMutation = useDeleteWarehouse();
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = () => {
    deleteMutation.mutate(warehouse!.id, {
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

  if (isError || !warehouse) {
    return (
      <PageContainer>
        <ErrorState
          title="Warehouse not found"
          message={error?.message ?? 'Unable to load warehouse details.'}
          onRetry={() => refetch()}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { label: 'Warehouses', href: '/warehouses' },
          { label: warehouse.name },
        ]}
      />
      <WarehouseInfoCard
        warehouse={warehouse}
        onDelete={() => setShowDelete(true)}
        isDeleting={deleteMutation.isPending}
      />

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Warehouse"
        message={`Are you sure you want to delete "${warehouse.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </PageContainer>
  );
}
