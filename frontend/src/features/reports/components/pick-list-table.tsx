import { useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  type SortingState,
  type PaginationState,
} from '@tanstack/react-table';
import { RefreshCw, Download } from 'lucide-react';
import { DataTable } from '@/components/common/data-table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/status-badge';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { toast } from 'sonner';
import { useState } from 'react';
import type { PickListPerformanceItem, PickListPerformanceSummary } from '../types';

const columnHelper = createColumnHelper<PickListPerformanceItem>();

interface PickListTableProps {
  data: PickListPerformanceItem[];
  summary: PickListPerformanceSummary | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onRefresh: () => void;
}

export function PickListTable({
  data,
  summary,
  isLoading,
  isError,
  error,
  onRefresh,
}: PickListTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor('pickListNumber', {
        header: 'Pick List #',
      }),
      columnHelper.accessor('workerName', {
        header: 'Worker',
        cell: (info) => info.getValue() ?? 'Unassigned',
      }),
      columnHelper.accessor('deviceCount', {
        header: 'Devices',
      }),
      columnHelper.accessor('priority', {
        header: 'Priority',
        cell: (info) => <Badge variant="outline">{info.getValue()}</Badge>,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.accessor('durationMinutes', {
        header: 'Duration (min)',
        cell: (info) =>
          info.getValue() != null ? `${Math.round(info.getValue()!)}` : '-',
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created',
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: false,
    manualPagination: false,
    pageCount: Math.ceil(data.length / pagination.pageSize),
  });

  const handleExportCSV = useCallback(() => {
    try {
      const headers = ['Pick List #,Worker,Devices,Priority,Status,Duration (min),Created'];
      const rows = data.map(
        (d) =>
          `"${d.pickListNumber}","${d.workerName ?? ''}",${d.deviceCount},"${d.priority}","${d.status}",${d.durationMinutes != null ? Math.round(d.durationMinutes) : ''},"${new Date(d.createdAt).toLocaleDateString()}"`,
      );
      const csv = [...headers, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pick-list-performance-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('CSV exported successfully');
    } catch {
      toast.error('Failed to export CSV');
    }
  }, [data]);

  if (isError) {
    return (
      <ErrorState
        title="Failed to load pick list report"
        message={error?.message ?? 'An error occurred'}
        onRetry={onRefresh}
      />
    );
  }

  return (
    <div className="space-y-4">
      {summary && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground">Total Pick Lists</p>
            <p className="text-xl font-bold">{summary.totalPickLists}</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground">Completed</p>
            <p className="text-xl font-bold">{summary.completedPickLists}</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground">Avg Duration</p>
            <p className="text-xl font-bold">{summary.averageDurationMinutes} min</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground">Fastest</p>
            <p className="text-xl font-bold">
              {summary.fastestDurationMinutes != null
                ? `${summary.fastestDurationMinutes} min`
                : '-'}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" className="gap-2" onClick={handleExportCSV}>
          <Download className="size-4" />
          Export CSV
        </Button>
        <Button variant="outline" size="icon" onClick={onRefresh}>
          <RefreshCw className="size-4" />
        </Button>
      </div>

      <DataTable
        table={table}
        isLoading={isLoading}
        emptyState={
          <EmptyState title="No pick list data" description="No pick list records found." />
        }
      />

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Page {pagination.pageIndex + 1} of{' '}
          {Math.ceil(data.length / pagination.pageSize) || 1} ({data.length} total)
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
