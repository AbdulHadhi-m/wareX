import { Pencil, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/common/status-badge';
import { useAuth } from '@/features/auth';
import {
  useWarehouseById,
  useZoneById,
  useAisleById,
  useBinById,
} from '../hooks/use-devices';
import type { Device } from '../types';

interface DeviceInfoCardProps {
  device: Device;
  onDelete: () => void;
  isDeleting: boolean;
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">
        {value ?? '-'}
      </span>
    </div>
  );
}

export function DeviceInfoCard({
  device,
  onDelete,
  isDeleting,
}: DeviceInfoCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isManager = user?.role === 'Manager';

  const { data: warehouse } = useWarehouseById(device.warehouseId);
  const { data: zone } = useZoneById(device.zoneId);
  const { data: aisle } = useAisleById(device.aisleId);
  const { data: bin } = useBinById(device.binId);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">{device.deviceName}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                SN: {device.serialNumber}
              </p>
            </div>
            <StatusBadge status={device.status} />
          </CardHeader>
          <CardContent>
            <h4 className="text-sm font-medium text-foreground mb-2">
              Device Information
            </h4>
            <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
              <InfoRow label="Brand" value={device.brand} />
              <InfoRow label="Model" value={device.model} />
              <InfoRow label="Category" value={device.category} />
              <InfoRow label="SKU" value={device.sku} />
              <InfoRow label="Serial Number" value={device.serialNumber} />
              <InfoRow label="IMEI" value={device.imei} />
              <InfoRow label="Status" value={device.status} />
              <InfoRow label="Condition" value={device.condition} />
              <InfoRow label="Purchase Date" value={device.purchaseDate} />
              <InfoRow label="Warranty Expiry" value={device.warrantyExpiry} />
              <div className="sm:col-span-2">
                <InfoRow label="Notes" value={device.notes} />
              </div>
            </div>

            <Separator className="my-4" />

            <h4 className="text-sm font-medium text-foreground mb-2">
              Current Location
            </h4>
            <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
              {warehouse && (
                <div className="flex justify-between gap-4 py-2">
                  <span className="text-sm text-muted-foreground">Warehouse</span>
                  <button
                    onClick={() => navigate(`/warehouses/${warehouse.id}`)}
                    className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    {warehouse.name} ({warehouse.code})
                    <ExternalLink className="size-3" />
                  </button>
                </div>
              )}
              {zone && (
                <div className="flex justify-between gap-4 py-2">
                  <span className="text-sm text-muted-foreground">Zone</span>
                  <button
                    onClick={() => navigate(`/zones/${zone.id}`)}
                    className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    {zone.name} ({zone.code})
                    <ExternalLink className="size-3" />
                  </button>
                </div>
              )}
              {aisle && (
                <div className="flex justify-between gap-4 py-2">
                  <span className="text-sm text-muted-foreground">Aisle</span>
                  <button
                    onClick={() => navigate(`/aisles/${aisle.id}`)}
                    className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    {aisle.name} ({aisle.code})
                    <ExternalLink className="size-3" />
                  </button>
                </div>
              )}
              {bin && (
                <div className="flex justify-between gap-4 py-2">
                  <span className="text-sm text-muted-foreground">Bin</span>
                  <button
                    onClick={() => navigate(`/bins/${bin.id}`)}
                    className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    {bin.name} ({bin.code})
                    <ExternalLink className="size-3" />
                  </button>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
              <InfoRow
                label="Created"
                value={new Date(device.createdAt).toLocaleDateString()}
              />
              <InfoRow
                label="Updated"
                value={new Date(device.updatedAt).toLocaleDateString()}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isManager && (
              <>
                <Button
                  className="w-full gap-2"
                  variant="outline"
                  onClick={() => navigate(`/devices/${device.id}/edit`)}
                >
                  <Pencil className="size-4" />
                  Edit Device
                </Button>
                <Button
                  className="w-full gap-2"
                  variant="destructive"
                  onClick={onDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className="size-4" />
                  {isDeleting ? 'Deleting...' : 'Delete Device'}
                </Button>
                <Separator />
              </>
            )}
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Created: {new Date(device.createdAt).toLocaleDateString()}</p>
              <p>Updated: {new Date(device.updatedAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
