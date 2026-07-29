import { useState, useMemo, useCallback } from 'react';
import { type SortingState, type PaginationState } from '@tanstack/react-table';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { NotificationTable } from '../components/notification-table';
import { useNotifications } from '../hooks/use-notifications';
import type { NotificationType } from '../types';

export function NotificationListPage() {
  const [readFilter, setReadFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const params = useMemo(() => {
    const sortBy = sorting[0];
    return {
      isRead:
        readFilter === 'unread' ? false : readFilter === 'read' ? true : undefined,
      type: (typeFilter || undefined) as NotificationType | undefined,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sortBy: sortBy?.id,
      sortOrder: sortBy?.desc ? ('desc' as const) : ('asc' as const),
    };
  }, [readFilter, typeFilter, sorting, pagination]);

  const { data, isLoading, isError, error, refetch } = useNotifications(params);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <PageContainer>
      <PageHeader
        title="Notifications"
        description="View system alerts and notifications."
      />
      <NotificationTable
        data={data?.data ?? []}
        isLoading={isLoading}
        isError={isError}
        error={error}
        total={data?.meta?.total ?? 0}
        sorting={sorting}
        onSortingChange={setSorting}
        pagination={pagination}
        onPaginationChange={setPagination}
        onRefresh={handleRefresh}
        readFilter={readFilter}
        onReadFilterChange={setReadFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />
    </PageContainer>
  );
}
