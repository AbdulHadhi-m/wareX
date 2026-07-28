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
import { useOrderStatusReport } from '../hooks/use-dashboard';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';

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

export function OrdersStatusBarChart() {
  const { data, isLoading, isError, error, refetch } = useOrderStatusReport();

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Orders by Status</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center py-8"><LoadingSpinner /></CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Orders by Status</CardTitle></CardHeader>
        <CardContent>
          <ErrorState title="Failed to load" message={error?.message ?? ''} onRetry={() => refetch()} />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Orders by Status</CardTitle></CardHeader>
        <CardContent><EmptyState title="No data" /></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Orders by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
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
              <Tooltip
                formatter={(value) => [value, 'Orders']}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((entry) => (
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
