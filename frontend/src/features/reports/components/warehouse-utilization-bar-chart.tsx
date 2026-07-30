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
import { useWarehouseUtilization } from '../hooks/use-reports';

export function WarehouseUtilizationBarChart() {
  const { data, isLoading, isError, error, refetch } = useWarehouseUtilization();

  return (
    <ChartCard
      title="Warehouse Utilization"
      subtitle="Storage occupancy percentage by warehouse facility"
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      isEmpty={!data || data.length === 0}
    >
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            layout="vertical"
            barCategoryGap={16}
          >
            <CartesianGrid strokeDasharray="4 4" horizontal={false} className="stroke-border/40" />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-muted-foreground"
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="warehouseName"
              tick={{ fontSize: 12, fill: 'currentColor' }}
              width={140}
              className="text-foreground font-medium"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  const pct = item.utilizationPercentage ?? 0;
                  const color = pct >= 85 ? '#f43f5e' : pct >= 60 ? '#f59e0b' : '#10b981';
                  return (
                    <div className="rounded-lg border border-border/60 bg-popover/95 p-3 shadow-xl backdrop-blur-md text-xs">
                      <div className="font-semibold text-foreground">{item.warehouseName}</div>
                      <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                        <span>Utilization Rate:</span>
                        <span className="font-bold" style={{ color }}>{pct}%</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="utilizationPercentage" barSize={22} radius={[0, 6, 6, 0]}>
              {data?.map((entry) => {
                const pct = entry.utilizationPercentage ?? 0;
                const fill = pct >= 85 ? '#f43f5e' : pct >= 60 ? '#f59e0b' : '#10b981';
                return <Cell key={entry.warehouseId} fill={fill} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
