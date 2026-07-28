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
import { useWarehouseUtilization } from '../hooks/use-dashboard';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';

function getColor(percentage: number): string {
  if (percentage >= 80) return '#ef4444';
  if (percentage >= 60) return '#f59e0b';
  if (percentage >= 30) return '#3b82f6';
  return '#22c55e';
}

export function WarehouseUtilizationChart() {
  const { data, isLoading, isError, error, refetch } = useWarehouseUtilization();

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Warehouse Utilization</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center py-8"><LoadingSpinner /></CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Warehouse Utilization</CardTitle></CardHeader>
        <CardContent>
          <ErrorState title="Failed to load" message={error?.message ?? ''} onRetry={() => refetch()} />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Warehouse Utilization</CardTitle></CardHeader>
        <CardContent><EmptyState title="No data" /></CardContent>
      </Card>
    );
  }

  const chartData = data
    .map((w) => ({
      name: w.warehouseName.length > 15 ? w.warehouseName.slice(0, 15) + '...' : w.warehouseName,
      percentage: Math.round(w.utilizationPercentage),
      full: w.warehouseName,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Warehouse Utilization (%)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12 }}
                width={90}
                className="text-muted-foreground"
              />
              <Tooltip
                formatter={(value) => [`${value}%`, 'Utilization']}
                labelFormatter={(label) => {
                  const lbl = typeof label === 'string' ? label : String(label);
                  return chartData.find((d) => d.name === lbl)?.full ?? lbl;
                }}
              />
              <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={getColor(entry.percentage)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
