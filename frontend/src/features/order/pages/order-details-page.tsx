import { useParams } from 'react-router-dom';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { PageContainer } from '@/components/common/page-container';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorState } from '@/components/common/error-state';
import { OrderInfoCard } from '../components/order-info-card';
import { OrderItemsTable } from '../components/order-items-table';
import { useOrder } from '../hooks/use-orders';

export function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, isError, error, refetch } = useOrder(id!);

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
          { label: order.orderNumber },
        ]}
      />
      <OrderInfoCard order={order} />
      <div className="mt-6">
        <OrderItemsTable deviceIds={order.deviceIds} />
      </div>
    </PageContainer>
  );
}
