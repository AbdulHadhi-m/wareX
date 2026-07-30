import { useNavigate, useLocation } from 'react-router-dom';
import {
  Building2,
  Layers,
  Cpu,
  CheckCircle2,
  Bookmark,
  Wrench,
  ShoppingCart,
  Clock,
  ClipboardList,
  ArrowLeftRight,
  Loader2,
} from 'lucide-react';
import { PageContainer } from '@/components/common/page-container';
import { ErrorState } from '@/components/common/error-state';
import { KpiCard } from '../components/kpi-card';
import { DeviceStatusPieChart } from '../components/device-status-pie-chart';
import { OrdersByStatusBarChart } from '../components/orders-by-status-bar-chart';
import { PickListsByStatusBarChart } from '../components/pick-lists-by-status-bar-chart';
import { WarehouseUtilizationBarChart } from '../components/warehouse-utilization-bar-chart';
import { useReportsDashboard } from '../hooks/use-reports';
import type { DashboardData } from '../types';

const reportTabs = [
  { label: 'Overview', path: '/reports' },
  { label: 'Devices', path: '/reports/devices' },
  { label: 'Inventory', path: '/reports/inventory' },
  { label: 'Orders', path: '/reports/orders' },
  { label: 'Pick Lists', path: '/reports/pick-lists' },
];

function cardsFromData(data: DashboardData) {
  const { facilities, inventorySummary, orderSummary, pickListSummary } = data;
  const totalOrders =
    orderSummary.draft +
    orderSummary.pending +
    orderSummary.picking +
    orderSummary.ready +
    orderSummary.fulfilled +
    orderSummary.cancelled;
  const maintenanceDevices =
    inventorySummary.picked + inventorySummary.damaged + inventorySummary.returned;

  return [
    { label: 'Total Warehouses', value: facilities.totalWarehouses, icon: <Building2 className="size-5" />, variant: 'indigo' as const },
    { label: 'Total Zones', value: facilities.totalZones, icon: <Layers className="size-5" />, variant: 'blue' as const },
    { label: 'Total Devices', value: facilities.totalDevices, icon: <Cpu className="size-5" />, variant: 'purple' as const },
    { label: 'Available Devices', value: inventorySummary.available, icon: <CheckCircle2 className="size-5" />, variant: 'emerald' as const, subtitle: 'Ready' },
    { label: 'Reserved Devices', value: inventorySummary.reserved, icon: <Bookmark className="size-5" />, variant: 'amber' as const, subtitle: 'Allocated' },
    { label: 'Under Maintenance', value: maintenanceDevices, icon: <Wrench className="size-5" />, variant: 'rose' as const },
    { label: 'Total Orders', value: totalOrders, icon: <ShoppingCart className="size-5" />, variant: 'indigo' as const },
    { label: 'Pending Orders', value: orderSummary.pending, icon: <Clock className="size-5" />, variant: 'amber' as const },
    { label: 'Active Pick Lists', value: pickListSummary.assigned + pickListSummary.inProgress, icon: <ClipboardList className="size-5" />, variant: 'emerald' as const },
    { label: 'Inventory Movements', value: 0, icon: <ArrowLeftRight className="size-5" />, variant: 'slate' as const },
  ];
}

export function ReportsDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, isLoading, isError, error, refetch } = useReportsDashboard();

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Reports & Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Operational insights and performance metrics.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-1 border-b">
        {reportTabs.map((tab) => (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              location.pathname === tab.path
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <ErrorState
          title="Failed to load reports"
          message={error instanceof Error ? error.message : 'An error occurred'}
          onRetry={() => refetch()}
        />
      ) : data ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {cardsFromData(data).map((card) => (
              <KpiCard key={card.label} {...card} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <DeviceStatusPieChart />
            <WarehouseUtilizationBarChart />
            <OrdersByStatusBarChart />
            <PickListsByStatusBarChart />
          </div>
        </div>
      ) : null}
    </PageContainer>
  );
}
