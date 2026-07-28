import { DeviceStatusPieChart } from './device-status-pie-chart';
import { OrdersStatusBarChart } from './orders-status-bar-chart';
import { PickListStatusBarChart } from './pick-list-status-bar-chart';
import { WarehouseUtilizationChart } from './warehouse-utilization-chart';

export function ChartsSection() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <DeviceStatusPieChart />
      <OrdersStatusBarChart />
      <PickListStatusBarChart />
      <WarehouseUtilizationChart />
    </div>
  );
}
