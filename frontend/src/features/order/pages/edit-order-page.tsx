import { useParams } from 'react-router-dom';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorState } from '@/components/common/error-state';
import { OrderForm } from '../components/order-form';
import { useOrder, useUpdateOrder } from '../hooks/use-orders';
import type { CreateOrderFormData } from '../schemas/order-schema';

export function EditOrderPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, isError, error, refetch } = useOrder(id!);
  const updateMutation = useUpdateOrder(id!);

  const handleSubmit = (data: CreateOrderFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingSpinner size="lg" className="py-16" />
      </PageContainer>
    );
  }

  if (isError || !order) {
    return (
      <PageContainer>
        <ErrorState
          title="Order not found"
          message={error?.message ?? 'Unable to load order details.'}
          onRetry={() => refetch()}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { label: 'Orders', href: '/dashboard/orders' },
          { label: order.orderNumber, href: `/dashboard/orders/${order.id}` },
          { label: 'Edit' },
        ]}
      />
      <PageHeader
        title={`Edit: ${order.orderNumber}`}
        description="Update order information."
      />
      <OrderForm
        defaultValues={order}
        isPending={updateMutation.isPending}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}
