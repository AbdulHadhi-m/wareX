import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { type SortingState, type PaginationState } from '@tanstack/react-table';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth';
import { BinTable } from '../components/bin-table';
import type { BinStatus } from '../types';
import {
  useBins,
  useWarehouses,
  useAllZones,
  useAllAisles,
} from '../hooks/use-bins';

export function BinListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isManager = user?.role === 'Manager' || user?.role === 'SuperAdmin';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [zoneFilter, setZoneFilter] = useState('');
  const [aisleFilter, setAisleFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: warehouses = [] } = useWarehouses();
  const { data: allZones = [] } = useAllZones();
  const { data: allAisles = [] } = useAllAisles();

  const zones = useMemo(
    () => (warehouseFilter ? allZones.filter((z) => z.warehouseId === warehouseFilter) : allZones),
    [allZones, warehouseFilter],
  );

  const aisles = useMemo(() => {
    let filtered = allAisles;
    if (warehouseFilter) {
      const zoneIds = new Set(allZones.filter((z) => z.warehouseId === warehouseFilter).map((z) => z.id));
      filtered = filtered.filter((a) => zoneIds.has(a.zoneId));
    }
    if (zoneFilter) {
      filtered = filtered.filter((a) => a.zoneId === zoneFilter);
    }
    return filtered;
  }, [allAisles, allZones, warehouseFilter, zoneFilter]);

  const params = useMemo(() => {
    const sortBy = sorting[0];
    return {
      search: search || undefined,
      aisleId: aisleFilter || undefined,
      status: statusFilter ? (statusFilter as BinStatus) : undefined,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sortBy: sortBy?.id,
      sortOrder: sortBy?.desc ? ('desc' as const) : ('asc' as const),
    };
  }, [search, statusFilter, aisleFilter, sorting, pagination]);

  const { data, isLoading, isError, error, refetch } = useBins(params);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <PageContainer>
      <PageHeader
        title="Bins"
        description="Define storage bins for device placement."
        actions={
          isManager && (
            <Button onClick={() => navigate('/dashboard/bins/new')} className="gap-2">
              <Plus className="size-4" />
              Create Bin
            </Button>
          )
        }
      />
      <BinTable
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
        warehouseFilter={warehouseFilter}
        onWarehouseFilterChange={setWarehouseFilter}
        zoneFilter={zoneFilter}
        onZoneFilterChange={setZoneFilter}
        aisleFilter={aisleFilter}
        onAisleFilterChange={setAisleFilter}
        warehouses={warehouses}
        zones={zones}
        aisles={aisles}
        allZones={allZones}
        allAisles={allAisles}
      />
    </PageContainer>
  );
}
