import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  type SortingState,
  type PaginationState,
  type OnChangeFn,
} from '@tanstack/react-table';
import { Eye, Move, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/common/data-table';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/common/search-input';
import { StatusBadge } from '@/components/common/status-badge';
import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { useAuth } from '@/features/auth';
import type {
  InventoryDevice,
  NamedEntity,
  ZoneOption,
  AisleOption,
  BinOption,
} from '../types';

const columnHelper = createColumnHelper<InventoryDevice>();

interface InventoryTableProps {
  data: InventoryDevice[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  total: number;
  search: string;
  onSearchChange: (value: string) => void;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  onRefresh: () => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  warehouseFilter: string;
  onWarehouseFilterChange: (value: string) => void;
  zoneFilter: string;
  onZoneFilterChange: (value: string) => void;
  aisleFilter: string;
  onAisleFilterChange: (value: string) => void;
  binFilter: string;
  onBinFilterChange: (value: string) => void;
  warehouses: NamedEntity[];
  zones: ZoneOption[];
  aisles: AisleOption[];
  bins: BinOption[];
}

export function InventoryTable({
  data,
  isLoading,
  isError,
  error,
  total,
  search,
  onSearchChange,
  sorting,
  onSortingChange,
  pagination,
  onPaginationChange,
  onRefresh,
  statusFilter,
  onStatusFilterChange,
  warehouseFilter,
  onWarehouseFilterChange,
  zoneFilter,
  onZoneFilterChange,
  aisleFilter,
  onAisleFilterChange,
  binFilter,
  onBinFilterChange,
  warehouses,
  zones,
  aisles,
  bins,
}: InventoryTableProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isManager = user?.role === 'Manager';

  const warehouseMap = useMemo(
    () => new Map(warehouses.map((w) => [w.id, w])),
    [warehouses],
  );
  const zoneMap = useMemo(() => new Map(zones.map((z) => [z.id, z])), [zones]);
  const aisleMap = useMemo(
    () => new Map(aisles.map((a) => [a.id, a])),
    [aisles],
  );
  const binMap = useMemo(() => new Map(bins.map((b) => [b.id, b])), [bins]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('deviceName', {
        header: 'Device Name',
        cell: (info) => (
          <button
            onClick={() => navigate(`/devices/${info.row.original.id}`)}
            className="font-medium text-foreground hover:text-primary transition-colors"
          >
            {info.getValue()}
          </button>
        ),
      }),
      columnHelper.accessor('serialNumber', { header: 'Serial No.' }),
      columnHelper.accessor('warehouseId', {
        header: 'Warehouse',
        cell: (info) => {
          const wh = warehouseMap.get(info.getValue());
          return wh ? `${wh.name} (${wh.code})` : '-';
        },
      }),
      columnHelper.accessor('zoneId', {
        header: 'Zone',
        cell: (info) => {
          const z = zoneMap.get(info.getValue());
          return z ? `${z.name} (${z.code})` : '-';
        },
      }),
      columnHelper.accessor('aisleId', {
        header: 'Aisle',
        cell: (info) => {
          const a = aisleMap.get(info.getValue());
          return a ? `${a.name} (${a.code})` : '-';
        },
      }),
      columnHelper.accessor('binId', {
        header: 'Bin',
        cell: (info) => {
          const b = binMap.get(info.getValue());
          return b ? `${b.name} (${b.code})` : '-';
        },
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.display({
        id: 'lastMovement',
        header: 'Last Movement',
        cell: () => '-',
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/devices/${info.row.original.id}`)}
            >
              <Eye className="size-4" />
            </Button>
            {isManager && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  navigate(`/inventory/move/${info.row.original.id}`)
                }
              >
                <Move className="size-4" />
              </Button>
            )}
          </div>
        ),
      }),
    ],
    [navigate, isManager, warehouseMap, zoneMap, aisleMap, binMap],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    pageCount: Math.ceil(total / pagination.pageSize),
  });

  if (isError) {
    return (
      <ErrorState
        title="Failed to load inventory"
        message={error?.message ?? 'An error occurred'}
        onRetry={onRefresh}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          <SearchInput
            placeholder="Search inventory..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
            className="w-full sm:w-56"
          />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Reserved">Reserved</option>
            <option value="Picked">Picked</option>
            <option value="Shipped">Shipped</option>
            <option value="Damaged">Damaged</option>
            <option value="Returned">Returned</option>
          </select>
          <select
            value={warehouseFilter}
            onChange={(e) => {
              onWarehouseFilterChange(e.target.value);
              onZoneFilterChange('');
              onAisleFilterChange('');
              onBinFilterChange('');
            }}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All Warehouses</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
          <select
            value={zoneFilter}
            onChange={(e) => {
              onZoneFilterChange(e.target.value);
              onAisleFilterChange('');
              onBinFilterChange('');
            }}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            disabled={!warehouseFilter}
          >
            <option value="">All Zones</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
          <select
            value={aisleFilter}
            onChange={(e) => {
              onAisleFilterChange(e.target.value);
              onBinFilterChange('');
            }}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            disabled={!zoneFilter}
          >
            <option value="">All Aisles</option>
            {aisles.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <select
            value={binFilter}
            onChange={(e) => onBinFilterChange(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            disabled={!aisleFilter}
          >
            <option value="">All Bins</option>
            {bins.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <Button variant="outline" size="icon" onClick={onRefresh}>
          <RefreshCw className="size-4" />
        </Button>
      </div>

      <DataTable
        table={table}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            title="No devices in inventory"
            description={
              search || statusFilter || warehouseFilter || zoneFilter || aisleFilter || binFilter
                ? 'Try a different search term or filter.'
                : 'No devices have been registered yet.'
            }
            action={
              !search &&
              !statusFilter &&
              !warehouseFilter &&
              !zoneFilter &&
              !aisleFilter &&
              !binFilter
                ? { label: 'Register Device', onClick: () => navigate('/devices/new') }
                : undefined
            }
          />
        }
      />

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Page {pagination.pageIndex + 1} of {Math.ceil(total / pagination.pageSize) || 1} (
          {total} total)
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
