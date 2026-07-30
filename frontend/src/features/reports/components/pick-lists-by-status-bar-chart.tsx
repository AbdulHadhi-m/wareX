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
import { useReportsDashboard } from '../hooks/use-reports';

const STATUS_COLORS: Record<string, string> = {
  Draft: '#64748b',
  Assigned: '#f59e0b',
  'In Progress': '#3b82f6',
  Completed: '#10b981',
  Cancelled: '#f43f5e',
};

function getColor(status: string): string {
  return STATUS_COLORS[status] ?? '#64748b';
}

export function PickListsByStatusBarChart() {
  const { data, isLoading, isError, error, refetch } = useReportsDashboard();

  const chartData = data
    ? [
        { status: 'Draft', count: data.pickListSummary.draft ?? 0 },
        { status: 'Assigned', count: data.pickListSummary.assigned },
        { status: 'In Progress', count: data.pickListSummary.inProgress },
        { status: 'Completed', count: data.pickListSummary.completed },
        { status: 'Cancelled', count: data.pickListSummary.cancelled },
      ]
    : [];

  const isEmpty = !chartData || chartData.reduce((sum, item) => sum + item.count, 0) === 0;

  return (
    <ChartCard
      title="Pick Lists by Status"
      subtitle="Overview of picking task progress across warehouses"
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      isEmpty={isEmpty}
      isEmptyMessage="No active or completed pick lists"
    >
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} className="stroke-border/40" />
            <XAxis
              dataKey="status"
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-muted-foreground font-medium"
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-muted-foreground"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  const color = getColor(item.status);
                  return (
                    <div className="rounded-lg border border-border/60 bg-popover/95 p-2.5 shadow-xl backdrop-blur-md text-xs">
                      <div className="flex items-center gap-2 font-semibold text-foreground">
                        <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
                        {item.status} Pick Lists
                      </div>
                      <div className="mt-1 text-muted-foreground">
                        Count: <span className="font-bold text-foreground">{item.count}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" barSize={32} radius={[6, 6, 0, 0]}>
              {chartData.map((entry) => (
                <Cell key={entry.status} fill={getColor(entry.status)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
