import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageContainer } from '@/components/common/page-container';
import { InventoryTable } from '../components/inventory-table';
import { ReportFilters } from '../components/report-filters';
import { useInventoryReport } from '../hooks/use-reports';
import type { ReportFilters as Filters } from '../types';

const STATUS_OPTIONS = [
  { value: 'Available', label: 'Available' },
  { value: 'Reserved', label: 'Reserved' },
  { value: 'Picked', label: 'Picked' },
  { value: 'Shipped', label: 'Shipped' },
  { value: 'Damaged', label: 'Damaged' },
  { value: 'Returned', label: 'Returned' },
];

const reportTabs = [
  { label: 'Overview', path: '/reports' },
  { label: 'Devices', path: '/reports/devices' },
  { label: 'Inventory', path: '/reports/inventory' },
  { label: 'Orders', path: '/reports/orders' },
  { label: 'Pick Lists', path: '/reports/pick-lists' },
];

export function InventoryReportsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filters: Filters = useMemo(
    () => ({
      status: statusFilter || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    }),
    [statusFilter, dateFrom, dateTo],
  );

  const { data, isLoading, isError, error, refetch } = useInventoryReport(filters);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Reports & Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Inventory report with location details.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-1 border-b">
        {reportTabs.map((tab) => (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              location.pathname === tab.path
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <ReportFilters
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          statusOptions={STATUS_OPTIONS}
          onRefresh={handleRefresh}
          showDateRange={false}
        />
        <InventoryTable
          data={data?.data ?? []}
          total={data?.total ?? 0}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRefresh={handleRefresh}
        />
      </div>
    </PageContainer>
  );
}
