import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageContainer } from '@/components/common/page-container';
import { OrdersByStatusBarChart } from '../components/orders-by-status-bar-chart';
import { ReportFilters } from '../components/report-filters';
import type { ReportFilters as Filters } from '../types';

const reportTabs = [
  { label: 'Overview', path: '/reports' },
  { label: 'Devices', path: '/reports/devices' },
  { label: 'Inventory', path: '/reports/inventory' },
  { label: 'Orders', path: '/reports/orders' },
  { label: 'Pick Lists', path: '/reports/pick-lists' },
];

export function OrderReportsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filters: Filters = useMemo(
    () => ({
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    }),
    [dateFrom, dateTo],
  );

  const handleRefresh = useCallback(() => {
    setDateFrom('');
    setDateTo('');
  }, []);

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Reports & Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Order status distribution reports.</p>
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
          onRefresh={handleRefresh}
        />
        <OrdersByStatusBarChart filters={filters} />
      </div>
    </PageContainer>
  );
}
