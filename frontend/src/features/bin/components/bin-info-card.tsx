import { Pencil, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/common/status-badge';
import { useAuth } from '@/features/auth';
import {
  useAisleById,
  useZoneById,
  useWarehouseById,
} from '../hooks/use-bins';
import type { Bin } from '../types';

interface BinInfoCardProps {
  bin: Bin;
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

export function BinInfoCard({ bin, onDelete, isDeleting }: BinInfoCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isManager = user?.role === 'Manager';

  const { data: aisle } = useAisleById(bin.aisleId);
  const { data: zone } = useZoneById(aisle?.zoneId ?? '');
  const { data: warehouse } = useWarehouseById(zone?.warehouseId ?? '');

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">{bin.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Code: {bin.code}</p>
            </div>
            <StatusBadge status={bin.status} />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
              <InfoRow label="Description" value={bin.description} />
              <InfoRow label="Capacity" value={String(bin.capacity)} />
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
              <InfoRow
                label="Created"
                value={new Date(bin.createdAt).toLocaleDateString()}
              />
              <InfoRow
                label="Updated"
                value={new Date(bin.updatedAt).toLocaleDateString()}
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
                  onClick={() => navigate(`/bins/${bin.id}/edit`)}
                >
                  <Pencil className="size-4" />
                  Edit Bin
                </Button>
                <Button
                  className="w-full gap-2"
                  variant="destructive"
                  onClick={onDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className="size-4" />
                  {isDeleting ? 'Deleting...' : 'Delete Bin'}
                </Button>
                <Separator />
              </>
            )}
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Created: {new Date(bin.createdAt).toLocaleDateString()}</p>
              <p>Updated: {new Date(bin.updatedAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
