import { useMemo, useState, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  type SortingState,
  type PaginationState,
  type OnChangeFn,
} from '@tanstack/react-table';
import { Eye, Trash2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/common/data-table';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import type { Notification } from '../types';
import { useDeleteNotification } from '../hooks/use-notifications';
import { NotificationTypeIcon } from './notification-type-icon';

const columnHelper = createColumnHelper<Notification>();

interface NotificationTableProps {
  data: Notification[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  total: number;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  onRefresh: () => void;
  readFilter: string;
  onReadFilterChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
}

const notificationTypes = [
  'Order Created',
  'Order Cancelled',
  'Order Fulfilled',
  'Pick List Assigned',
  'Pick List Started',
  'Pick List Completed',
  'Pick List Cancelled',
  'Device Reserved',
  'Device Moved',
  'Inventory Updated',
  'System',
] as const;

export function NotificationTable({
  data,
  isLoading,
  isError,
  error,
  total,
  sorting,
  onSortingChange,
  pagination,
  onPaginationChange,
  onRefresh,
  readFilter,
  onReadFilterChange,
  typeFilter,
  onTypeFilterChange,
}: NotificationTableProps) {
  const navigate = useNavigate();
  const deleteMutation = useDeleteNotification();
  const [deleteTarget, setDeleteTarget] = useState<Notification | null>(null);

  const columns = useMemo(
    () => [
      columnHelper.accessor('type', {
        header: 'Type',
        cell: (info) => <NotificationTypeIcon type={info.getValue()} />,
      }),
      columnHelper.accessor('title', {
        header: 'Title',
        cell: (info) => (
          <button
            onClick={() => navigate(`/notifications/${info.row.original.id}`)}
            className="font-medium text-foreground hover:text-primary transition-colors text-left"
          >
            {info.getValue()}
          </button>
        ),
      }),
      columnHelper.accessor('type', {
        header: 'Notification Type',
        cell: (info) => (
          <span className="text-sm text-muted-foreground">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('isRead', {
        header: 'Status',
        cell: (info) =>
          info.getValue() ? (
            <span className="text-sm text-muted-foreground">Read</span>
          ) : (
            <span className="text-sm font-medium text-foreground">Unread</span>
          ),
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
              onClick={() => navigate(`/notifications/${info.row.original.id}`)}
            >
              <Eye className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteTarget(info.row.original)}
            >
              <Trash2 className="size-4 text-destructive" />
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

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  }, [deleteTarget, deleteMutation]);

  if (isError) {
    return (
      <ErrorState
        title="Failed to load notifications"
        message={error?.message ?? 'An error occurred'}
        onRetry={onRefresh}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          <select
            value={readFilter}
            onChange={(e) => onReadFilterChange(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All Types</option>
            {notificationTypes.map((t) => (
              <option key={t} value={t}>
                {t}
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
            title="No notifications found"
            description={
              readFilter || typeFilter
                ? 'Try a different filter.'
                : 'No notifications yet.'
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
        title="Delete Notification"
        message={`Are you sure you want to delete this notification?`}
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
