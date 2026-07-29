import { useMemo, useState, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  type SortingState,
  type PaginationState,
} from '@tanstack/react-table';
import { RefreshCw, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/common/data-table';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/common/search-input';
import { StatusBadge } from '@/components/common/status-badge';
import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { toast } from 'sonner';
import type { InventoryReportItem } from '../types';

const columnHelper = createColumnHelper<InventoryReportItem>();

interface InventoryTableProps {
  data: InventoryReportItem[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  total: number;
  onRefresh: () => void;
}

export function InventoryTable({
  data,
  isLoading,
  isError,
  error,
  total,
  onRefresh,
}: InventoryTableProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(
      (item) =>
        item.deviceName.toLowerCase().includes(q) ||
        item.serialNumber.toLowerCase().includes(q) ||
        item.sku?.toLowerCase().includes(q),
    );
  }, [data, search]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('deviceName', {
        header: 'Device Name',
        cell: (info) => (
          <button
            onClick={() => navigate(`/dashboard/devices/${info.row.original.deviceId}`)}
            className="font-medium text-foreground hover:text-primary transition-colors"
          >
            {info.getValue()}
          </button>
        ),
      }),
      columnHelper.accessor('sku', {
        header: 'SKU',
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.accessor('serialNumber', { header: 'Serial No.' }),
      columnHelper.accessor('category', { header: 'Category' }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.accessor('condition', { header: 'Condition' }),
      columnHelper.accessor('warehouseName', {
        header: 'Warehouse',
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.accessor('binCode', {
        header: 'Bin',
        cell: (info) => info.getValue() ?? '-',
      }),
    ],
    [navigate],
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: false,
    manualPagination: false,
    pageCount: Math.ceil(filtered.length / pagination.pageSize),
  });

  const handleExportCSV = useCallback(() => {
    try {
      const headers = ['Device Name,SKU,Serial No,Category,Status,Condition,Warehouse,Bin'];
      const rows = data.map(
        (d) =>
          `"${d.deviceName}","${d.sku ?? ''}","${d.serialNumber}","${d.category}","${d.status}","${d.condition}","${d.warehouseName ?? ''}","${d.binCode ?? ''}"`,
      );
      const csv = [...headers, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-report-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('CSV exported successfully');
    } catch {
      toast.error('Failed to export CSV');
    }
  }, [data]);

  if (isError) {
    return (
      <ErrorState
        title="Failed to load inventory report"
        message={error?.message ?? 'An error occurred'}
        onRetry={onRefresh}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Search inventory..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          className="w-full sm:w-64"
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExportCSV}>
            <Download className="size-4" />
            Export CSV
          </Button>
          <Button variant="outline" size="icon" onClick={onRefresh}>
            <RefreshCw className="size-4" />
          </Button>
        </div>
      </div>

      <DataTable
        table={table}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            title="No inventory data"
            description={
              search ? 'Try a different search term.' : 'No inventory records found.'
            }
          />
        }
      />

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Page {pagination.pageIndex + 1} of{' '}
          {Math.ceil(filtered.length / pagination.pageSize) || 1} ({filtered.length} of {total}{' '}
          total)
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
