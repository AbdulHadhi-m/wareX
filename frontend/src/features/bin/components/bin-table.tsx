import { useMemo, useState, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  type SortingState,
  type PaginationState,
  type OnChangeFn,
} from '@tanstack/react-table';
import { Eye, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/common/data-table';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/common/search-input';
import { StatusBadge } from '@/components/common/status-badge';
import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { useAuth } from '@/features/auth';
import type { Bin, NamedEntity, ZoneOption, AisleOption } from '../types';
import { useDeleteBin } from '../hooks/use-bins';

const columnHelper = createColumnHelper<Bin>();

interface BinTableProps {
  data: Bin[];
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
  warehouses: NamedEntity[];
  zones: ZoneOption[];
  aisles: AisleOption[];
}

export function BinTable({
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
  warehouses,
  zones,
  aisles,
}: BinTableProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isManager = user?.role === 'Manager';
  const deleteMutation = useDeleteBin();
  const [deleteTarget, setDeleteTarget] = useState<Bin | null>(null);

  const warehouseMap = useMemo(
    () => new Map(warehouses.map((w) => [w.id, w])),
    [warehouses],
  );

  const zoneMap = useMemo(() => new Map(zones.map((z) => [z.id, z])), [zones]);

  const aisleMap = useMemo(
    () => new Map(aisles.map((a) => [a.id, a])),
    [aisles],
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => (
          <button
            onClick={() => navigate(`/bins/${info.row.original.id}`)}
            className="font-medium text-foreground hover:text-primary transition-colors"
          >
            {info.getValue()}
          </button>
        ),
      }),
      columnHelper.accessor('code', { header: 'Code' }),
      columnHelper.accessor('aisleId', {
        header: 'Warehouse',
        cell: (info) => {
          const aisle = aisleMap.get(info.getValue());
          if (!aisle) return '-';
          const zone = zoneMap.get(aisle.zoneId);
          if (!zone) return '-';
          const wh = warehouseMap.get(zone.warehouseId);
          return wh ? `${wh.name} (${wh.code})` : '-';
        },
      }),
      columnHelper.accessor('aisleId', {
        header: 'Zone',
        cell: (info) => {
          const aisle = aisleMap.get(info.getValue());
          if (!aisle) return '-';
          const zone = zoneMap.get(aisle.zoneId);
          return zone ? `${zone.name} (${zone.code})` : '-';
        },
      }),
      columnHelper.accessor('aisleId', {
        header: 'Aisle',
        cell: (info) => {
          const aisle = aisleMap.get(info.getValue());
          return aisle ? `${aisle.name} (${aisle.code})` : '-';
        },
      }),
      columnHelper.accessor('capacity', {
        header: 'Capacity',
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created At',
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/bins/${info.row.original.id}`)}
            >
              <Eye className="size-4" />
            </Button>
            {isManager && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/bins/${info.row.original.id}/edit`)}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteTarget(info.row.original)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </>
            )}
          </div>
        ),
      }),
    ],
    [navigate, isManager, warehouseMap, zoneMap, aisleMap],
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

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  }, [deleteTarget, deleteMutation]);

  if (isError) {
    return (
      <ErrorState
        title="Failed to load bins"
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
            placeholder="Search bins..."
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
            <option value="Full">Full</option>
            <option value="Blocked">Blocked</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select
            value={warehouseFilter}
            onChange={(e) => {
              onWarehouseFilterChange(e.target.value);
              onZoneFilterChange('');
              onAisleFilterChange('');
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
            onChange={(e) => onAisleFilterChange(e.target.value)}
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
            title="No bins found"
            description={
              search || statusFilter || warehouseFilter || zoneFilter || aisleFilter
                ? 'Try a different search term or filter.'
                : 'Get started by creating your first bin.'
            }
            action={
              isManager && !search && !statusFilter && !warehouseFilter && !zoneFilter && !aisleFilter
                ? { label: 'Create Bin', onClick: () => navigate('/bins/new') }
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

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Bin"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
