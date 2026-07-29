import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  type SortingState,
  type PaginationState,
  type OnChangeFn,
} from '@tanstack/react-table';
import { DataTable } from '@/components/common/data-table';
import { EmptyState } from '@/components/common/empty-state';
import { Badge } from '@/components/ui/badge';
import type { MovementHistoryRecord } from '../types';

const columnHelper = createColumnHelper<MovementHistoryRecord>();

const movementVariantMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'> = {
  'Initial Placement': 'success',
  Transfer: 'warning',
  Return: 'secondary',
  Adjustment: 'default',
};

interface HistoryTableProps {
  data: MovementHistoryRecord[];
  isLoading: boolean;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
}

export function HistoryTable({
  data,
  isLoading,
  sorting,
  onSortingChange,
  pagination,
  onPaginationChange,
}: HistoryTableProps) {
  const columns = useMemo(
    () => [
      columnHelper.accessor('createdAt', {
        header: 'Date',
        cell: (info) => new Date(info.getValue()).toLocaleString(),
      }),
      columnHelper.accessor('deviceId', {
        header: 'Device',
        cell: (info) => info.getValue().slice(-8).toUpperCase(),
      }),
      columnHelper.accessor('movementType', {
        header: 'Movement Type',
        cell: (info) => (
          <Badge
            variant={
              movementVariantMap[info.getValue()] ?? 'default'
            }
          >
            {info.getValue()}
          </Badge>
        ),
      }),
      columnHelper.accessor('fromBinId', {
        header: 'Source Bin',
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.accessor('toBinId', {
        header: 'Destination Bin',
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.accessor('performedBy', {
        header: 'Performed By',
        cell: (info) => info.getValue().slice(-8).toUpperCase(),
      }),
      columnHelper.accessor('reason', {
        header: 'Reason',
        cell: (info) => info.getValue() ?? '-',
      }),
    ],
    [],
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
    pageCount: Math.ceil(data.length / pagination.pageSize),
  });

  return (
    <DataTable
      table={table}
      isLoading={isLoading}
      emptyState={
        <EmptyState
          title="No movement history"
          description="This device has not been moved yet."
        />
      }
    />
  );
}
