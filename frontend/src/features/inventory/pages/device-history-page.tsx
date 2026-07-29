import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { type SortingState, type PaginationState } from '@tanstack/react-table';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorState } from '@/components/common/error-state';
import { HistoryTable } from '../components/history-table';
import { useDeviceHistory } from '../hooks/use-inventory';

export function DeviceHistoryPage() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const { data: history, isLoading, isError, error, refetch } = useDeviceHistory(deviceId!);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const sortedData = useMemo(() => {
    if (!history) return [];
    const sorted = [...history];
    const sortBy = sorting[0];
    if (sortBy) {
      sorted.sort((a, b) => {
        const aVal = String((a as unknown as Record<string, unknown>)[sortBy.id] ?? '');
        const bVal = String((b as unknown as Record<string, unknown>)[sortBy.id] ?? '');
        return sortBy.desc
          ? bVal.localeCompare(aVal)
          : aVal.localeCompare(bVal);
      });
    }
    return sorted;
  }, [history, sorting]);

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingSpinner size="lg" className="py-16" />
      </PageContainer>
    );
  }

  if (isError || !history) {
    return (
      <PageContainer>
        <ErrorState
          title="Failed to load history"
          message={error?.message ?? 'Unable to load movement history.'}
          onRetry={() => refetch()}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { label: 'Inventory', href: '/inventory' },
          { label: 'Device History' },
        ]}
      />
      <PageHeader
        title="Movement History"
        description={`Device: ${deviceId?.slice(-8).toUpperCase()}`}
      />
      <HistoryTable
        data={sortedData}
        isLoading={false}
        sorting={sorting}
        onSortingChange={setSorting}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </PageContainer>
  );
}
