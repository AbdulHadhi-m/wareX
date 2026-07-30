import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { type SortingState, type PaginationState } from '@tanstack/react-table';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth';
import { AisleTable } from '../components/aisle-table';
import { useAisles, useWarehousesForAisle, useAllZones } from '../hooks/use-aisles';
import type { NamedEntity } from '../types';

export function AisleListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isManager = user?.role === 'Manager' || user?.role === 'SuperAdmin';

  const [search, setSearch] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [zoneFilter, setZoneFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const { data: warehouses = [] } = useWarehousesForAisle();
  const { data: rawZones = [] } = useAllZones();

  const warehouseZoneMap = useMemo(() => {
    const map = new Map<string, NamedEntity[]>();
    rawZones.forEach((z) => {
      if (z.warehouseId) {
        const list = map.get(z.warehouseId) ?? [];
        list.push({ id: z.id, name: z.name, code: z.code });
        map.set(z.warehouseId, list);
      }
    });
    return map;
  }, [rawZones]);

  const params = useMemo(() => {
    const sortBy = sorting[0];
    return {
      search: search || undefined,
      zoneId: zoneFilter || undefined,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sortBy: sortBy?.id,
      sortOrder: sortBy?.desc ? ('desc' as const) : ('asc' as const),
    };
  }, [search, zoneFilter, sorting, pagination]);

  const { data, isLoading, isError, error, refetch } = useAisles(params);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <PageContainer>
      <PageHeader
        title="Aisles"
        description="Configure aisles within warehouse zones."
        actions={
          isManager && (
            <Button onClick={() => navigate('/dashboard/aisles/new')} className="gap-2">
              <Plus className="size-4" />
              Create Aisle
            </Button>
          )
        }
      />
      <AisleTable
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
        zoneFilter={zoneFilter}
        onZoneFilterChange={setZoneFilter}
        warehouses={warehouses}
        zones={rawZones}
        warehouseZoneMap={warehouseZoneMap}
      />
    </PageContainer>
  );
}
