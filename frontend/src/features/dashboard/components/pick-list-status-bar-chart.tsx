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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';
import { useDashboardSummary } from '../hooks/use-dashboard';

const STATUS_COLORS: Record<string, string> = {
  assigned: '#3b82f6',
  inProgress: '#f59e0b',
  completed: '#22c55e',
  cancelled: '#ef4444',
};

function getColor(status: string): string {
  return STATUS_COLORS[status] ?? '#6b7280';
}

function toChartData(pickListSummary: { assigned: number; inProgress: number; completed: number; cancelled: number }) {
  const labelMap: Record<string, string> = {
    assigned: 'Assigned',
    inProgress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return Object.entries(pickListSummary)
    .filter(([, count]) => count > 0)
    .map(([key, count]) => ({ status: labelMap[key] ?? key, count }));
}

export function PickListStatusBarChart() {
  const { data, isLoading, isError, error, refetch } = useDashboardSummary();

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Pick List Status</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center py-8"><LoadingSpinner /></CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Pick List Status</CardTitle></CardHeader>
        <CardContent>
          <ErrorState title="Failed to load" message={error?.message ?? ''} onRetry={() => refetch()} />
        </CardContent>
      </Card>
    );
  }

  const chartData = data ? toChartData(data.pickListSummary) : [];

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Pick List Status</CardTitle></CardHeader>
        <CardContent><EmptyState title="No data" /></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Pick List Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
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
              <Tooltip
                formatter={(value) => [value, 'Pick Lists']}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.status} fill={getColor(entry.status.toLowerCase())} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
