import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { type SortingState, type PaginationState } from '@tanstack/react-table';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth';
import { OrderTable } from '../components/order-table';
import { useOrders } from '../hooks/use-orders';

export function OrderListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isManager = user?.role === 'Manager';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const params = useMemo(() => {
    const sortBy = sorting[0];
    return {
      search: search || undefined,
      status: (statusFilter || undefined) as
        | 'Draft'
        | 'Pending'
        | 'Picking'
        | 'Ready'
        | 'Fulfilled'
        | 'Cancelled'
        | undefined,
      priority: (priorityFilter || undefined) as
        | 'Low'
        | 'Medium'
        | 'High'
        | 'Urgent'
        | undefined,
      createdAtGte: dateFrom || undefined,
      createdAtLte: dateTo || undefined,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sortBy: sortBy?.id,
      sortOrder: sortBy?.desc ? ('desc' as const) : ('asc' as const),
    };
  }, [search, statusFilter, priorityFilter, dateFrom, dateTo, sorting, pagination]);

  const { data, isLoading, isError, error, refetch } = useOrders(params);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <PageContainer>
      <PageHeader
        title="Orders"
        description="Manage customer orders and fulfillment."
        actions={
          isManager && (
            <Button onClick={() => navigate('/dashboard/orders/new')} className="gap-2">
              <Plus className="size-4" />
              Create Order
            </Button>
          )
        }
      />
      <OrderTable
        data={data?.data ?? []}
        isLoading={isLoading}
        isError={isError}
        error={error}
        total={data?.meta?.total ?? 0}
        search={search}
        onSearchChange={setSearch}
        sorting={sorting}
        onSortingChange={setSorting}
        pagination={pagination}
        onPaginationChange={setPagination}
        onRefresh={handleRefresh}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
      />
    </PageContainer>
  );
}
