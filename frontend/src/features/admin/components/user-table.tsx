import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  type SortingState,
  type PaginationState,
  type OnChangeFn,
} from '@tanstack/react-table';
import { Eye, Pencil, Trash2, RefreshCw, UserCheck, UserX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/common/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchInput } from '@/components/common/search-input';
import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import type { AdminUser } from '../types';
import { useDeleteAdminUser, useUpdateAdminUser } from '../hooks/use-admin-users';

const columnHelper = createColumnHelper<AdminUser>();

interface UserTableProps {
  data: AdminUser[];
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
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
}

export function UserTable({
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
  roleFilter,
  onRoleFilterChange,
}: UserTableProps) {
  const navigate = useNavigate();
  const deleteMutation = useDeleteAdminUser();
  const updateMutation = useUpdateAdminUser();
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [toggleTarget, setToggleTarget] = useState<AdminUser | null>(null);

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => (
          <button
            onClick={() => navigate(`/dashboard/admin/users/${info.row.original.id}`)}
            className="font-medium text-foreground hover:text-primary transition-colors"
          >
            {info.getValue()}
          </button>
        ),
      }),
      columnHelper.accessor('email', { header: 'Email' }),
      columnHelper.accessor('role', {
        header: 'Role',
        cell: (info) => (
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('isActive', {
        header: 'Status',
        cell: (info) => {
          const isActive = info.getValue() ?? true;
          return (
            <Badge variant={isActive ? 'success' : 'destructive'} className="font-semibold">
              {isActive ? 'Active' : 'Suspended'}
            </Badge>
          );
        },
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created At',
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const user = info.row.original;
          const isActive = user.isActive ?? true;
          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                title="View User Details"
                onClick={() => navigate(`/dashboard/admin/users/${user.id}`)}
              >
                <Eye className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Edit User"
                onClick={() => navigate(`/dashboard/admin/users/${user.id}/edit`)}
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title={isActive ? 'Suspend User' : 'Activate User'}
                onClick={() => setToggleTarget(user)}
                className={isActive ? 'hover:text-amber-600' : 'hover:text-emerald-600'}
              >
                {isActive ? (
                  <UserX className="size-4 text-amber-500" />
                ) : (
                  <UserCheck className="size-4 text-emerald-500" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Delete User"
                onClick={() => setDeleteTarget(user)}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          );
        },
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

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const handleToggleStatus = () => {
    if (!toggleTarget) return;
    const nextStatus = !(toggleTarget.isActive ?? true);
    updateMutation.mutate(
      { id: toggleTarget.id, data: { isActive: nextStatus } },
      { onSuccess: () => setToggleTarget(null) },
    );
  };

  if (isError) {
    return (
      <ErrorState
        title="Failed to load users"
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
            placeholder="Search users..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
            className="w-full sm:w-72"
          />
          <select
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All Roles</option>
            <option value="SuperAdmin">Super Admin</option>
            <option value="Manager">Manager</option>
            <option value="Worker">Worker</option>
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
            title="No users found"
            description={search || roleFilter ? 'Try a different search term or filter.' : 'Get started by creating your first user.'}
            action={!search && !roleFilter ? { label: 'Create User', onClick: () => navigate('/dashboard/admin/users/new') } : undefined}
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
        open={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        onConfirm={handleToggleStatus}
        title={(toggleTarget?.isActive ?? true) ? 'Suspend User' : 'Activate User'}
        message={
          (toggleTarget?.isActive ?? true)
            ? `Are you sure you want to suspend "${toggleTarget?.name}"? Suspended users will be immediately blocked from signing in or calling API endpoints.`
            : `Are you sure you want to reactivate "${toggleTarget?.name}"? Reactivated users will be granted login and operational permissions again.`
        }
        confirmLabel={(toggleTarget?.isActive ?? true) ? 'Suspend' : 'Activate'}
        variant={(toggleTarget?.isActive ?? true) ? 'destructive' : 'default'}
        loading={updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
