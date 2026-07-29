import { Breadcrumb } from '@/components/common/breadcrumb';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { OrderForm } from '../components/order-form';
import { useCreateOrder } from '../hooks/use-orders';
import type { CreateOrderFormData } from '../schemas/order-schema';

export function CreateOrderPage() {
  const createMutation = useCreateOrder();

  const handleSubmit = (data: CreateOrderFormData) => {
    createMutation.mutate(data);
  };

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { label: 'Orders', href: '/dashboard/orders' },
          { label: 'Create Order' },
        ]}
      />
      <PageHeader title="Create Order" description="Create a new customer order." />
      <OrderForm isPending={createMutation.isPending} onSubmit={handleSubmit} />
    </PageContainer>
  );
}
