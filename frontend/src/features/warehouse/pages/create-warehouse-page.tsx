import { Breadcrumb } from '@/components/common/breadcrumb';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { WarehouseForm } from '../components/warehouse-form';
import { useCreateWarehouse } from '../hooks/use-warehouses';
import type { CreateWarehouseFormData } from '../schemas/warehouse-schema';

export function CreateWarehousePage() {
  const createMutation = useCreateWarehouse();

  const handleSubmit = (data: CreateWarehouseFormData) => {
    createMutation.mutate(data);
  };

  return (
    <PageContainer>
      <Breadcrumb items={[{ label: 'Warehouses', href: '/dashboard/warehouses' }, { label: 'Create Warehouse' }]} />
      <PageHeader
        title="Create Warehouse"
        description="Add a new warehouse to the system."
      />
      <WarehouseForm isPending={createMutation.isPending} onSubmit={handleSubmit} />
    </PageContainer>
  );
}
