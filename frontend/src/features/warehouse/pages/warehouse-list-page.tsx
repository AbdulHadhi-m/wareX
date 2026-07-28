import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { type SortingState, type PaginationState } from '@tanstack/react-table';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth';
import { WarehouseTable } from '../components/warehouse-table';
import { useWarehouses } from '../hooks/use-warehouses';

export function WarehouseListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isManager = user?.role === 'Manager';

  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const params = useMemo(() => {
    const sortBy = sorting[0];
    return {
      search: search || undefined,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sortBy: sortBy?.id,
      sortOrder: sortBy?.desc ? ('desc' as const) : ('asc' as const),
    };
  }, [search, sorting, pagination]);

  const { data, isLoading, isError, error, refetch } = useWarehouses(params);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <PageContainer>
      <PageHeader
        title="Warehouses"
        description="Manage warehouse locations and facilities."
        actions={
          isManager && (
            <Button onClick={() => navigate('/warehouses/new')} className="gap-2">
              <Plus className="size-4" />
              Create Warehouse
            </Button>
          )
        }
      />
      <WarehouseTable
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
      />
    </PageContainer>
  );
}
