import {
  Building2,
  Layers,
  ArrowLeftRight,
  Box,
  Cpu,
  CheckCircle2,
  Bookmark,
  ClipboardList,
  Clock,
  Loader2,
} from 'lucide-react';
import { SummaryCard } from './summary-card';
import { useDashboardSummary } from '../hooks/use-dashboard';
import { ErrorState } from '@/components/common/error-state';
import type { DashboardData } from '../types';

function cardsFromData(data: DashboardData) {
  const { facilities, inventorySummary, orderSummary, pickListSummary } = data;
  return [
    { label: 'Total Warehouses', value: facilities.totalWarehouses, icon: <Building2 className="size-5" /> },
    { label: 'Total Zones', value: facilities.totalZones, icon: <Layers className="size-5" /> },
    { label: 'Total Aisles', value: facilities.totalAisles, icon: <ArrowLeftRight className="size-5" /> },
    { label: 'Total Bins', value: facilities.totalBins, icon: <Box className="size-5" /> },
    { label: 'Total Devices', value: facilities.totalDevices, icon: <Cpu className="size-5" /> },
    { label: 'Available Devices', value: inventorySummary.available, icon: <CheckCircle2 className="size-5" /> },
    { label: 'Reserved Devices', value: inventorySummary.reserved, icon: <Bookmark className="size-5" /> },
    { label: 'Pick Lists In Progress', value: pickListSummary.inProgress, icon: <ClipboardList className="size-5" /> },
    { label: 'Pending Orders', value: orderSummary.pending, icon: <Clock className="size-5" /> },
  ];
}

export function SummaryCardsGrid() {
  const { data, isLoading, isError, error, refetch } = useDashboardSummary();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load summary"
        message={error instanceof Error ? error.message : 'An error occurred'}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data) return null;

  const cards = cardsFromData(data);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {cards.map((card) => (
        <SummaryCard key={card.label} {...card} />
      ))}
    </div>
  );
}
