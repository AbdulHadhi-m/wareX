import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDeviceStatusReport } from '../hooks/use-dashboard';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';

const COLORS: Record<string, string> = {
  Available: '#22c55e',
  Reserved: '#3b82f6',
  Picked: '#f59e0b',
  Damaged: '#ef4444',
  Returned: '#8b5cf6',
  Shipped: '#06b6d4',
};

function getColor(status: string): string {
  return COLORS[status] ?? '#6b7280';
}

export function DeviceStatusPieChart() {
  const { data, isLoading, isError, error, refetch } = useDeviceStatusReport();

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Device Status</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center py-8"><LoadingSpinner /></CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Device Status</CardTitle></CardHeader>
        <CardContent>
          <ErrorState title="Failed to load" message={error?.message ?? ''} onRetry={() => refetch()} />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Device Status</CardTitle></CardHeader>
        <CardContent><EmptyState title="No data" /></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Device Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={55}
                paddingAngle={2}
              >
                {data.map((entry) => (
                  <Cell key={entry.status} fill={getColor(entry.status)} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} devices`]}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value: string) => (
                  <span className="text-xs text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
