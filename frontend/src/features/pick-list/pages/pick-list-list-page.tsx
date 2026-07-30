import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { type SortingState, type PaginationState } from '@tanstack/react-table';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth';
import { PickListTable } from '../components/pick-list-table';
import { usePickLists } from '../hooks/use-pick-lists';

export function PickListListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isManager = user?.role === 'Manager' || user?.role === 'SuperAdmin';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const params = useMemo(() => {
    const sortBy = sorting[0];
    return {
      search: search || undefined,
      status: (statusFilter || undefined) as
        | 'Draft'
        | 'Assigned'
        | 'In Progress'
        | 'Completed'
        | 'Cancelled'
        | undefined,
      priority: (priorityFilter || undefined) as
        | 'Low'
        | 'Medium'
        | 'High'
        | 'Urgent'
        | undefined,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sortBy: sortBy?.id,
      sortOrder: sortBy?.desc ? ('desc' as const) : ('asc' as const),
    };
  }, [search, statusFilter, priorityFilter, sorting, pagination]);

  const { data, isLoading, isError, error, refetch } = usePickLists(params);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <PageContainer>
      <PageHeader
        title="Pick Lists"
        description="Create and manage picking tasks for orders."
        actions={
          isManager && (
            <Button onClick={() => navigate('/dashboard/pick-lists/new')} className="gap-2">
              <Plus className="size-4" />
              Create Pick List
            </Button>
          )
        }
      />
      <PickListTable
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
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
      />
    </PageContainer>
  );
}
