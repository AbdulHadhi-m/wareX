import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReportFiltersProps {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  warehouseFilter?: string;
  onWarehouseFilterChange?: (value: string) => void;
  warehouses?: { id: string; name: string }[];
  statusFilter?: string;
  onStatusFilterChange?: (value: string) => void;
  statusOptions?: { value: string; label: string }[];
  onRefresh: () => void;
  showDateRange?: boolean;
  children?: React.ReactNode;
}

export function ReportFilters({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  warehouseFilter,
  onWarehouseFilterChange,
  warehouses = [],
  statusFilter,
  onStatusFilterChange,
  statusOptions = [],
  onRefresh,
  showDateRange = true,
  children,
}: ReportFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 flex-1 flex-wrap">
        {showDateRange && (
          <>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              title="From date"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              title="To date"
            />
          </>
        )}
        {onWarehouseFilterChange && (
          <select
            value={warehouseFilter ?? ''}
            onChange={(e) => onWarehouseFilterChange(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All Warehouses</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        )}
        {onStatusFilterChange && statusOptions.length > 0 && (
          <select
            value={statusFilter ?? ''}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
        {children}
      </div>
      <Button variant="outline" size="icon" onClick={onRefresh}>
        <RefreshCw className="size-4" />
      </Button>
    </div>
  );
}
