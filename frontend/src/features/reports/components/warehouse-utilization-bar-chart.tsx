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
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      isEmpty={!data || data.length === 0}
    >
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted" />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="warehouseName"
              tick={{ fontSize: 12 }}
              width={120}
              className="text-muted-foreground"
            />
            <Tooltip
              formatter={(value) => [`${value ?? 0}%`, 'Utilization']}
            />
            <Bar dataKey="utilizationPercentage" radius={[0, 4, 4, 0]}>
              {data?.map((entry) => (
                <Cell
                  key={entry.warehouseId}
                  fill={
                    entry.utilizationPercentage >= 80
                      ? '#ef4444'
                      : entry.utilizationPercentage >= 50
                        ? '#f59e0b'
                        : '#22c55e'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
