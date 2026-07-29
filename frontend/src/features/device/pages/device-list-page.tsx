import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { type SortingState, type PaginationState } from '@tanstack/react-table';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth';
import type { DeviceStatus, DeviceCondition } from '../types';
import { DeviceTable } from '../components/device-table';
import {
  useDevices,
  useWarehousesForDevice,
  useZonesByWarehouse,
  useAislesByZone,
  useBinsByAisle,
} from '../hooks/use-devices';

export function DeviceListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isManager = user?.role === 'Manager';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [zoneFilter, setZoneFilter] = useState('');
  const [aisleFilter, setAisleFilter] = useState('');
  const [binFilter, setBinFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: warehouses = [] } = useWarehousesForDevice();
  const { data: zones = [] } = useZonesByWarehouse(warehouseFilter);
  const { data: aisles = [] } = useAislesByZone(zoneFilter);
  const { data: bins = [] } = useBinsByAisle(aisleFilter);

  const params = useMemo(() => {
    const sortBy = sorting[0];
    return {
      search: search || undefined,
      status: statusFilter ? (statusFilter as DeviceStatus) : undefined,
      condition: conditionFilter ? (conditionFilter as DeviceCondition) : undefined,
      brand: brandFilter || undefined,
      category: categoryFilter || undefined,
      warehouseId: warehouseFilter || undefined,
      zoneId: zoneFilter || undefined,
      aisleId: aisleFilter || undefined,
      binId: binFilter || undefined,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sortBy: sortBy?.id,
      sortOrder: sortBy?.desc ? ('desc' as const) : ('asc' as const),
    };
  }, [
    search,
    statusFilter,
    conditionFilter,
    brandFilter,
    categoryFilter,
    warehouseFilter,
    zoneFilter,
    aisleFilter,
    binFilter,
    sorting,
    pagination,
  ]);

  const { data, isLoading, isError, error, refetch } = useDevices(params);

  const brands = useMemo(
    () => [...new Set(data?.data?.map((d) => d.brand).filter(Boolean) ?? [])],
    [data?.data],
  );

  const categories = useMemo(
    () => [
      ...new Set(data?.data?.map((d) => d.category).filter(Boolean) ?? []),
    ],
    [data?.data],
  );

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <PageContainer>
      <PageHeader
        title="Devices"
        description="Track and manage all devices in inventory."
        actions={
          isManager && (
            <Button onClick={() => navigate('/dashboard/devices/new')} className="gap-2">
              <Plus className="size-4" />
              Register Device
            </Button>
          )
        }
      />
      <DeviceTable
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
        conditionFilter={conditionFilter}
        onConditionFilterChange={setConditionFilter}
        brandFilter={brandFilter}
        onBrandFilterChange={setBrandFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        warehouseFilter={warehouseFilter}
        onWarehouseFilterChange={setWarehouseFilter}
        zoneFilter={zoneFilter}
        onZoneFilterChange={setZoneFilter}
        aisleFilter={aisleFilter}
        onAisleFilterChange={setAisleFilter}
        binFilter={binFilter}
        onBinFilterChange={setBinFilter}
        warehouses={warehouses}
        zones={zones}
        aisles={aisles}
        bins={bins}
        brands={brands}
        categories={categories}
      />
    </PageContainer>
  );
}
