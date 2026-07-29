import { Pencil, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/common/status-badge';
import { useAuth } from '@/features/auth';
import { useWarehousesForAisle, useAllZones } from '../hooks/use-aisles';
import type { Aisle } from '../types';

interface AisleInfoCardProps {
  aisle: Aisle;
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

export function AisleInfoCard({ aisle, onDelete, isDeleting }: AisleInfoCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isManager = user?.role === 'Manager';
  const { data: warehouses = [] } = useWarehousesForAisle();
  const { data: allZones = [] } = useAllZones();

  const zone = allZones.find((z) => z.id === aisle.zoneId);
  const warehouse = zone
    ? warehouses.find((w) => w.id === zone.warehouseId)
    : undefined;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">{aisle.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Code: {aisle.code}</p>
            </div>
            <StatusBadge status={aisle.status} />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
              <InfoRow label="Description" value={aisle.description} />
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
              <InfoRow label="Created" value={new Date(aisle.createdAt).toLocaleDateString()} />
              <InfoRow label="Updated" value={new Date(aisle.updatedAt).toLocaleDateString()} />
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
                  onClick={() => navigate(`/aisles/${aisle.id}/edit`)}
                >
                  <Pencil className="size-4" />
                  Edit Aisle
                </Button>
                <Button
                  className="w-full gap-2"
                  variant="destructive"
                  onClick={onDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className="size-4" />
                  {isDeleting ? 'Deleting...' : 'Delete Aisle'}
                </Button>
                <Separator />
              </>
            )}
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Created: {new Date(aisle.createdAt).toLocaleDateString()}</p>
              <p>Updated: {new Date(aisle.updatedAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
