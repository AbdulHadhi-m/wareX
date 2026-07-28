import { useParams } from 'react-router-dom';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorState } from '@/components/common/error-state';
import { WarehouseForm } from '../components/warehouse-form';
import { useWarehouse, useUpdateWarehouse } from '../hooks/use-warehouses';
import type { CreateWarehouseFormData } from '../schemas/warehouse-schema';

export function EditWarehousePage() {
  const { id } = useParams<{ id: string }>();
  const { data: warehouse, isLoading, isError, error, refetch } = useWarehouse(id!);
  const updateMutation = useUpdateWarehouse(id!);

  const handleSubmit = (data: CreateWarehouseFormData) => {
    updateMutation.mutate(data);
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
          { label: warehouse.name, href: `/warehouses/${warehouse.id}` },
          { label: 'Edit' },
        ]}
      />
      <PageHeader
        title={`Edit: ${warehouse.name}`}
        description="Update warehouse information."
      />
      <WarehouseForm
        defaultValues={warehouse}
        isPending={updateMutation.isPending}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}
