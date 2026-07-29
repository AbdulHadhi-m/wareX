import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  type SortingState,
  type PaginationState,
  type OnChangeFn,
} from '@tanstack/react-table';
import { Eye, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/common/data-table';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/common/search-input';
import { StatusBadge } from '@/components/common/status-badge';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import type { PickList, PickListPriority } from '../types';

const columnHelper = createColumnHelper<PickList>();

const priorityVariantMap: Record<
  PickListPriority,
  'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
> = {
  Low: 'secondary',
  Medium: 'default',
  High: 'warning',
  Urgent: 'destructive',
};

interface PickListTableProps {
  data: PickList[];
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
  priorityFilter: string;
  onPriorityFilterChange: (value: string) => void;
}

export function PickListTable({
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
  priorityFilter,
  onPriorityFilterChange,
}: PickListTableProps) {
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      columnHelper.accessor('pickListNumber', {
        header: 'Pick List #',
        cell: (info) => (
          <button
            onClick={() => navigate(`/dashboard/pick-lists/${info.row.original.id}`)}
            className="font-medium text-foreground hover:text-primary transition-colors"
          >
            {info.getValue()}
          </button>
        ),
      }),
      columnHelper.accessor('workerId', {
        header: 'Assigned Worker',
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.accessor('deviceIds', {
        header: 'Device Count',
        cell: (info) => info.getValue().length,
      }),
      columnHelper.accessor('priority', {
        header: 'Priority',
        cell: (info) => (
          <Badge variant={priorityVariantMap[info.getValue()] ?? 'default'}>
            {info.getValue()}
          </Badge>
        ),
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
              onClick={() => navigate(`/dashboard/pick-lists/${info.row.original.id}`)}
            >
              <Eye className="size-4" />
            </Button>
          </div>
        ),
      }),
    ],
    [navigate],
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
        title="Failed to load pick lists"
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
            placeholder="Search pick lists..."
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
            <option value="Draft">Draft</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
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
            title="No pick lists found"
            description={
              search || statusFilter || priorityFilter
                ? 'Try a different search term or filter.'
                : 'Get started by creating your first pick list.'
            }
            action={
              !search && !statusFilter && !priorityFilter
                ? { label: 'Create Pick List', onClick: () => navigate('/dashboard/pick-lists/new') }
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
