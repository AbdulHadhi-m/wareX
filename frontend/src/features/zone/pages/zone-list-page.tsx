import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { type SortingState, type PaginationState } from '@tanstack/react-table';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth';
import { ZoneTable } from '../components/zone-table';
import { useZones, useWarehousesForSelect } from '../hooks/use-zones';

export function ZoneListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isManager = user?.role === 'Manager' || user?.role === 'SuperAdmin';

  const [search, setSearch] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const { data: warehouses = [] } = useWarehousesForSelect();

  const params = useMemo(() => {
    const sortBy = sorting[0];
    return {
      search: search || undefined,
      warehouseId: warehouseFilter || undefined,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sortBy: sortBy?.id,
      sortOrder: sortBy?.desc ? ('desc' as const) : ('asc' as const),
    };
  }, [search, warehouseFilter, sorting, pagination]);

  const { data, isLoading, isError, error, refetch } = useZones(params);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <PageContainer>
      <PageHeader
        title="Zones"
        description="Organize warehouse spaces into functional zones."
        actions={
          isManager && (
            <Button onClick={() => navigate('/dashboard/zones/new')} className="gap-2">
              <Plus className="size-4" />
              Create Zone
            </Button>
          )
        }
      />
      <ZoneTable
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
        warehouseFilter={warehouseFilter}
        onWarehouseFilterChange={setWarehouseFilter}
        warehouses={warehouses}
      />
    </PageContainer>
  );
}
