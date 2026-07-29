import { useState, useMemo, useCallback } from 'react';
import { type SortingState, type PaginationState } from '@tanstack/react-table';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { InventoryTable } from '../components/inventory-table';
import {
  useInventory,
  useWarehousesForInventory,
  useZonesByWarehouse,
  useAislesByZone,
  useBinsByAisle,
} from '../hooks/use-inventory';

export function InventoryDashboardPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [zoneFilter, setZoneFilter] = useState('');
  const [aisleFilter, setAisleFilter] = useState('');
  const [binFilter, setBinFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: warehouses = [] } = useWarehousesForInventory();
  const { data: zones = [] } = useZonesByWarehouse(warehouseFilter);
  const { data: aisles = [] } = useAislesByZone(zoneFilter);
  const { data: bins = [] } = useBinsByAisle(aisleFilter);

  const params = useMemo(
    () => ({
      search: search || undefined,
      status: statusFilter || undefined,
      warehouseId: warehouseFilter || undefined,
      zoneId: zoneFilter || undefined,
      aisleId: aisleFilter || undefined,
      binId: binFilter || undefined,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    }),
    [
      search,
      statusFilter,
      warehouseFilter,
      zoneFilter,
      aisleFilter,
      binFilter,
      pagination,
    ],
  );

  const { data, isLoading, isError, error, refetch } = useInventory(params);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <PageContainer>
      <PageHeader
        title="Inventory"
        description="View and manage device locations and movements."
      />
      <InventoryTable
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
        binFilter={binFilter}
        onBinFilterChange={setBinFilter}
        warehouses={warehouses}
        zones={zones}
        aisles={aisles}
        bins={bins}
      />
    </PageContainer>
  );
}
