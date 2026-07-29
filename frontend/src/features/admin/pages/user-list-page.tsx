import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { type SortingState, type PaginationState } from '@tanstack/react-table';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { UserTable } from '../components/user-table';
import { useAdminUsers } from '../hooks/use-admin-users';

export function UserListPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const params = useMemo(() => {
    const sortBy = sorting[0];
    return {
      search: search || undefined,
      role: (roleFilter as 'SuperAdmin' | 'Manager' | 'Worker') || undefined,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sortBy: sortBy?.id,
      sortOrder: sortBy?.desc ? ('desc' as const) : ('asc' as const),
    };
  }, [search, roleFilter, sorting, pagination]);

  const { data, isLoading, isError, error, refetch } = useAdminUsers(params);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <PageContainer>
      <PageHeader
        title="User Management"
        description="Manage system users and their roles."
        actions={
          <Button onClick={() => navigate('/admin/users/new')} className="gap-2">
            <Plus className="size-4" />
            Create User
          </Button>
        }
      />
      <UserTable
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
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
      />
    </PageContainer>
  );
}
