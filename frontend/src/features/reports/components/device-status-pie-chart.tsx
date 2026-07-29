import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartCard } from './chart-card';
import { useDeviceStatusReport } from '../hooks/use-reports';
import type { ReportFilters } from '../types';

const STATUS_COLORS: Record<string, string> = {
  Available: '#22c55e',
  Reserved: '#f59e0b',
  Picked: '#3b82f6',
  Shipped: '#8b5cf6',
  Damaged: '#ef4444',
  Returned: '#6b7280',
};

function getColor(status: string): string {
  return STATUS_COLORS[status] ?? '#6b7280';
}

interface DeviceStatusPieChartProps {
  filters?: ReportFilters;
}

export function DeviceStatusPieChart({ filters }: DeviceStatusPieChartProps) {
  const { data, isLoading, isError, error, refetch } = useDeviceStatusReport(filters);

  return (
    <ChartCard
      title="Device Status Distribution"
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      isEmpty={!data || data.length === 0}
    >
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={55}
              label={({ name, payload }: { name?: string; payload?: { percentage?: number } }) =>
                `${name ?? ''} ${payload?.percentage ?? 0}%`
              }
            >
              {data?.map((entry) => (
                <Cell key={entry.status} fill={getColor(entry.status)} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [value ?? 0, 'Devices']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
