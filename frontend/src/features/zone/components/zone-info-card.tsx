import { Pencil, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/common/status-badge';
import { useAuth } from '@/features/auth';
import { useWarehousesForSelect } from '../hooks/use-zones';
import type { Zone } from '../types';

interface ZoneInfoCardProps {
  zone: Zone;
  onDelete: () => void;
  isDeleting: boolean;
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">{value || '-'}</span>
    </div>
  );
}

export function ZoneInfoCard({ zone, onDelete, isDeleting }: ZoneInfoCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isManager = user?.role === 'Manager';
  const { data: warehouses = [] } = useWarehousesForSelect();
  const warehouse = warehouses.find((w) => w.id === zone.warehouseId);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">{zone.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Code: {zone.code}</p>
            </div>
            <StatusBadge status={zone.status} />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
              <InfoRow label="Description" value={zone.description} />
              <div className="flex justify-between gap-4 py-2">
                <span className="text-sm text-muted-foreground">Warehouse</span>
                <button
                  onClick={() => navigate(`/warehouses/${zone.warehouseId}`)}
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  {warehouse ? `${warehouse.name} (${warehouse.code})` : zone.warehouseId}
                  <ExternalLink className="size-3" />
                </button>
              </div>
              <InfoRow label="Created" value={new Date(zone.createdAt).toLocaleDateString()} />
              <InfoRow label="Updated" value={new Date(zone.updatedAt).toLocaleDateString()} />
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
                  onClick={() => navigate(`/zones/${zone.id}/edit`)}
                >
                  <Pencil className="size-4" />
                  Edit Zone
                </Button>
                <Button
                  className="w-full gap-2"
                  variant="destructive"
                  onClick={onDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className="size-4" />
                  {isDeleting ? 'Deleting...' : 'Delete Zone'}
                </Button>
                <Separator />
              </>
            )}
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Created: {new Date(zone.createdAt).toLocaleDateString()}</p>
              <p>Updated: {new Date(zone.updatedAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
