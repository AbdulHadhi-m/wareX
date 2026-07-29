import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type { Device } from '@/features/device/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderItemsTableProps {
  deviceIds: string[];
}

export function OrderItemsTable({ deviceIds }: OrderItemsTableProps) {
  const { data: devices, isLoading } = useQuery({
    queryKey: ['order-devices', deviceIds],
    queryFn: async () => {
      const results = await Promise.allSettled(
        deviceIds.map((id) =>
          api.get<ApiResponse<Device>>(`/devices/${id}`).then((r) => r.data.data!),
        ),
      );
      return results
        .filter(
          (r): r is PromiseFulfilledResult<Device> => r.status === 'fulfilled' && r.value !== null,
        )
        .map((r) => r.value);
    },
    enabled: deviceIds.length > 0,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Order Items ({deviceIds.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : devices && devices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Device Name</th>
                  <th className="pb-2 font-medium">SKU</th>
                  <th className="pb-2 font-medium">Serial Number</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr key={device.id} className="border-b last:border-0">
                    <td className="py-2.5 font-medium text-foreground">
                      {device.deviceName}
                    </td>
                    <td className="py-2.5 text-muted-foreground">
                      {device.sku ?? '-'}
                    </td>
                    <td className="py-2.5 text-muted-foreground">
                      {device.serialNumber}
                    </td>
                    <td className="py-2.5">
                      <span className="capitalize text-muted-foreground">
                        {device.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No device details available.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
