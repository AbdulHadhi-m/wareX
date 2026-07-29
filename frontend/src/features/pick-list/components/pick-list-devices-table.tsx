import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from '@tanstack/react-table';
import { DataTable } from '@/components/common/data-table';
import { EmptyState } from '@/components/common/empty-state';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { StatusBadge } from '@/components/common/status-badge';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type { Device } from '@/features/device/types';

const columnHelper = createColumnHelper<Device>();

interface PickListDevicesTableProps {
  deviceIds: string[];
}

export function PickListDevicesTable({ deviceIds }: PickListDevicesTableProps) {
  const navigate = useNavigate();

  const { data: devices, isLoading } = useQuery({
    queryKey: ['devices-for-picklist', deviceIds],
    queryFn: async () => {
      const results: Device[] = [];
      for (const id of deviceIds) {
        try {
          const res = await api.get<ApiResponse<Device>>(`/devices/${id}`);
          if (res.data.data) results.push(res.data.data);
        } catch {
          // skip failed fetches
        }
      }
      return results;
    },
    enabled: deviceIds.length > 0,
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor('deviceName', {
        header: 'Device Name',
        cell: (info) => (
          <button
            onClick={() => navigate(`/devices/${info.row.original.id}`)}
            className="font-medium text-foreground hover:text-primary transition-colors"
          >
            {info.getValue()}
          </button>
        ),
      }),
      columnHelper.accessor('serialNumber', { header: 'Serial No.' }),
      columnHelper.accessor('warehouseId', {
        header: 'Warehouse',
        cell: (info) => info.getValue().slice(-6).toUpperCase(),
      }),
      columnHelper.accessor('zoneId', {
        header: 'Zone',
        cell: (info) => info.getValue().slice(-6).toUpperCase(),
      }),
      columnHelper.accessor('aisleId', {
        header: 'Aisle',
        cell: (info) => info.getValue().slice(-6).toUpperCase(),
      }),
      columnHelper.accessor('binId', {
        header: 'Bin',
        cell: (info) => info.getValue().slice(-6).toUpperCase(),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
    ],
    [navigate],
  );

  const table = useReactTable({
    data: devices ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    pageCount: 1,
  });

  if (isLoading) {
    return <LoadingSpinner size="lg" className="py-8" />;
  }

  return (
    <DataTable
      table={table}
      emptyState={
        <EmptyState
          title="No devices"
          description="No devices are associated with this pick list."
        />
      }
    />
  );
}
