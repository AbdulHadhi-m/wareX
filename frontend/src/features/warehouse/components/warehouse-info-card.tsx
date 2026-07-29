import { Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/features/auth';
import type { Warehouse } from '../types';

interface WarehouseInfoCardProps {
  warehouse: Warehouse;
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

export function WarehouseInfoCard({ warehouse, onDelete, isDeleting }: WarehouseInfoCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isManager = user?.role === 'Manager';

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">{warehouse.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Code: {warehouse.code}</p>
            </div>
            <Badge variant={warehouse.status === 'Active' ? 'success' : 'secondary'}>
              {warehouse.status}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
              <InfoRow label="Description" value={warehouse.description} />
              <InfoRow label="Address" value={warehouse.address} />
              <InfoRow label="City" value={warehouse.city} />
              <InfoRow label="State / Province" value={warehouse.state} />
              <InfoRow label="Country" value={warehouse.country} />
              <InfoRow label="Postal Code" value={warehouse.postalCode} />
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
                  onClick={() => navigate(`/dashboard/warehouses/${warehouse.id}/edit`)}
                >
                  <Pencil className="size-4" />
                  Edit Warehouse
                </Button>
                <Button
                  className="w-full gap-2"
                  variant="destructive"
                  onClick={onDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className="size-4" />
                  {isDeleting ? 'Deleting...' : 'Delete Warehouse'}
                </Button>
                <Separator />
              </>
            )}
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Created: {new Date(warehouse.createdAt).toLocaleDateString()}</p>
              <p>Updated: {new Date(warehouse.updatedAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
