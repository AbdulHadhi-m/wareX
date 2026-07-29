import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ChartCard } from './chart-card';
import { useOrderStatusReport } from '../hooks/use-reports';
import type { ReportFilters } from '../types';

const STATUS_COLORS: Record<string, string> = {
  Draft: '#6b7280',
  Pending: '#f59e0b',
  Picking: '#3b82f6',
  Ready: '#22c55e',
  Fulfilled: '#059669',
  Cancelled: '#ef4444',
};

function getColor(status: string): string {
  return STATUS_COLORS[status] ?? '#6b7280';
}

interface OrdersByStatusBarChartProps {
  filters?: ReportFilters;
}

export function OrdersByStatusBarChart({ filters }: OrdersByStatusBarChartProps) {
  const { data, isLoading, isError, error, refetch } = useOrderStatusReport(filters);

  return (
    <ChartCard
      title="Orders by Status"
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      isEmpty={!data || data.length === 0}
    >
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
            <XAxis
              dataKey="status"
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <Tooltip formatter={(value) => [value ?? 0, 'Orders']} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data?.map((entry) => (
                <Cell key={entry.status} fill={getColor(entry.status)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
