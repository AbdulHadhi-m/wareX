import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartCard } from './chart-card';
import { useDeviceStatusReport } from '../hooks/use-reports';
import type { ReportFilters } from '../types';

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  Available: { color: '#10b981', label: 'Available' },
  Reserved: { color: '#f59e0b', label: 'Reserved' },
  Picked: { color: '#3b82f6', label: 'Picked' },
  Shipped: { color: '#8b5cf6', label: 'Shipped' },
  Damaged: { color: '#f43f5e', label: 'Damaged' },
  Returned: { color: '#64748b', label: 'Returned' },
};

function getColor(status: string): string {
  return STATUS_CONFIG[status]?.color ?? '#64748b';
}

interface DeviceStatusPieChartProps {
  filters?: ReportFilters;
}

export function DeviceStatusPieChart({ filters }: DeviceStatusPieChartProps) {
  const { data, isLoading, isError, error, refetch } = useDeviceStatusReport(filters);

  const totalCount = useMemo(
    () => (data ? data.reduce((acc, curr) => acc + (curr.count || 0), 0) : 0),
    [data],
  );

  return (
    <ChartCard
      title="Device Status Distribution"
      subtitle="Current allocation of devices across inventory"
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      isEmpty={!data || data.length === 0}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative size-[220px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={68}
                outerRadius={95}
                paddingAngle={4}
                cornerRadius={6}
                stroke="none"
              >
                {data?.map((entry) => (
                  <Cell key={entry.status} fill={getColor(entry.status)} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    const color = getColor(item.status);
                    return (
                      <div className="rounded-lg border border-border/60 bg-popover/95 p-2.5 shadow-xl backdrop-blur-md text-xs">
                        <div className="flex items-center gap-2 font-semibold text-foreground">
                          <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
                          {item.status}
                        </div>
                        <div className="mt-1 text-muted-foreground">
                          <span className="font-bold text-foreground">{item.count}</span> devices ({item.percentage}%)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-2xl font-bold tracking-tight text-foreground">{totalCount}</span>
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Total Devices</span>
          </div>
        </div>

        <div className="flex-1 w-full grid grid-cols-2 gap-2.5">
          {data?.map((item) => {
            const color = getColor(item.status);
            return (
              <div
                key={item.status}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-muted/30 transition-colors hover:bg-muted/60"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-xs font-medium text-foreground truncate">{item.status}</span>
                </div>
                <div className="flex items-baseline gap-1.5 ml-2">
                  <span className="text-xs font-bold text-foreground">{item.count}</span>
                  <span className="text-[10px] text-muted-foreground font-medium">({item.percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ChartCard>
  );
}
