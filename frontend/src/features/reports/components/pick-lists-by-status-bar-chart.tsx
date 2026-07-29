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
import { useReportsDashboard } from '../hooks/use-reports';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';

const STATUS_COLORS: Record<string, string> = {
  Assigned: '#f59e0b',
  'In Progress': '#3b82f6',
  Completed: '#22c55e',
  Cancelled: '#ef4444',
};

export function PickListsByStatusBarChart() {
  const { data, isLoading, isError, error, refetch } = useReportsDashboard();

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Pick Lists by Status</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center py-12"><LoadingSpinner /></CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Pick Lists by Status</CardTitle></CardHeader>
        <CardContent>
          <ErrorState title="Failed to load" message={error?.message ?? ''} onRetry={() => refetch()} />
        </CardContent>
      </Card>
    );
  }

  const chartData = data
    ? [
        { status: 'Assigned', count: data.pickListSummary.assigned },
        { status: 'In Progress', count: data.pickListSummary.inProgress },
        { status: 'Completed', count: data.pickListSummary.completed },
        { status: 'Cancelled', count: data.pickListSummary.cancelled },
      ].filter((d) => d.count > 0)
    : [];

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Pick Lists by Status</CardTitle></CardHeader>
        <CardContent><EmptyState title="No data" /></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Pick Lists by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
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
              <Tooltip formatter={(value) => [value ?? 0, 'Pick Lists']} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.status} fill={getColor(entry.status)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function getColor(status: string): string {
  return STATUS_COLORS[status] ?? '#6b7280';
}
