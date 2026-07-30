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
import type { Aisle, NamedEntity, ZoneInfo } from '../types';
import { useDeleteAisle } from '../hooks/use-aisles';

const columnHelper = createColumnHelper<Aisle>();

interface AisleTableProps {
  data: Aisle[];
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
  warehouseFilter: string;
  onWarehouseFilterChange: (value: string) => void;
  zoneFilter: string;
  onZoneFilterChange: (value: string) => void;
  warehouses: NamedEntity[];
  zones: ZoneInfo[];
  warehouseZoneMap: Map<string, NamedEntity[]>;
}

export function AisleTable({
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
  warehouseFilter,
  onWarehouseFilterChange,
  zoneFilter,
  onZoneFilterChange,
  warehouses,
  zones,
  warehouseZoneMap,
}: AisleTableProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isManager = user?.role === 'Manager';
  const deleteMutation = useDeleteAisle();
  const [deleteTarget, setDeleteTarget] = useState<Aisle | null>(null);

  const warehouseMap = useMemo(
    () => new Map(warehouses.map((w) => [w.id, w])),
    [warehouses],
  );
  const zoneMap = useMemo(() => new Map(zones.map((z) => [z.id, z])), [zones]);

  const filteredZoneOptions = useMemo(() => {
    if (!warehouseFilter) return zones;
    return warehouseZoneMap.get(warehouseFilter) ?? [];
  }, [warehouseFilter, warehouseZoneMap, zones]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => (
          <button
            onClick={() => navigate(`/dashboard/aisles/${info.row.original.id}`)}
            className="font-medium text-foreground hover:text-primary transition-colors"
          >
            {info.getValue()}
          </button>
        ),
      }),
      columnHelper.accessor('code', { header: 'Code' }),
      columnHelper.accessor('zoneId', {
        header: 'Zone',
        cell: (info) => {
          const z = zoneMap.get(info.getValue());
          return z ? `${z.name} (${z.code})` : '-';
        },
      }),
      {
        id: 'warehouse',
        header: 'Warehouse',
        cell: (info: any) => {
          const aisle = info.row.original;
          const z = zoneMap.get(aisle.zoneId);
          if (!z) return '-';
          const w = warehouseMap.get(z.warehouseId);
          return w ? `${w.name} (${w.code})` : '-';
        },
      },
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
              onClick={() => navigate(`/dashboard/aisles/${info.row.original.id}`)}
            >
              <Eye className="size-4" />
            </Button>
            {isManager && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/dashboard/aisles/${info.row.original.id}/edit`)}
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
    [navigate, isManager, zoneMap, warehouseMap],
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
        title="Failed to load aisles"
        message={error?.message ?? 'An error occurred'}
        onRetry={onRefresh}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <SearchInput
            placeholder="Search aisles..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
            className="w-full sm:w-48"
          />
          <select
            value={warehouseFilter}
            onChange={(e) => {
              onWarehouseFilterChange(e.target.value);
              onZoneFilterChange('');
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
            onChange={(e) => onZoneFilterChange(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All Zones</option>
            {filteredZoneOptions.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
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
            title="No aisles found"
            description={
              search || warehouseFilter || zoneFilter
                ? 'Try a different search term or filter.'
                : 'Get started by creating your first aisle.'
            }
            action={
              isManager && !search && !warehouseFilter && !zoneFilter
                ? { label: 'Create Aisle', onClick: () => navigate('/dashboard/aisles/new') }
                : undefined
            }
          />
        }
      />

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Page {pagination.pageIndex + 1} of {Math.ceil(total / pagination.pageSize) || 1} ({total} total)
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
        title="Delete Aisle"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
