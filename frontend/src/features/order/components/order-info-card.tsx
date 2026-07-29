import {
  Pencil,
  XCircle,
  Package,
  CheckCircle2,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/common/status-badge';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/features/auth';
import {
  useCancelOrder,
  useGeneratePickList,
  useFulfillOrder,
} from '../hooks/use-orders';
import type { Order, OrderPriority } from '../types';

interface OrderInfoCardProps {
  order: Order;
}

const priorityVariantMap: Record<
  OrderPriority,
  'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
> = {
  Low: 'secondary',
  Medium: 'default',
  High: 'warning',
  Urgent: 'destructive',
};

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

export function OrderInfoCard({ order }: OrderInfoCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isManager = user?.role === 'Manager';

  const cancelMutation = useCancelOrder(order.id);
  const generatePickListMutation = useGeneratePickList(order.id);
  const fulfillMutation = useFulfillOrder(order.id);

  const canGeneratePickList =
    isManager && (order.status === 'Draft' || order.status === 'Pending') && !order.pickListId;
  const canCancel =
    isManager && order.status !== 'Fulfilled' && order.status !== 'Cancelled';
  const canFulfill =
    isManager && order.status === 'Ready';
  const canEdit =
    isManager && order.status !== 'Cancelled' && order.status !== 'Fulfilled';

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {order.orderNumber}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Priority:{' '}
                <Badge
                  variant={priorityVariantMap[order.priority] ?? 'default'}
                  className="ml-1"
                >
                  {order.priority}
                </Badge>
              </p>
            </div>
            <StatusBadge status={order.status} />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
              <InfoRow label="Customer Name" value={order.customerName} />
              <InfoRow label="Customer Reference" value={order.customerReference} />
              <InfoRow label="Device Count" value={String(order.deviceIds.length)} />
              <InfoRow label="Created By" value={order.createdBy} />
              <InfoRow
                label="Created"
                value={new Date(order.createdAt).toLocaleDateString()}
              />
              <InfoRow
                label="Updated"
                value={new Date(order.updatedAt).toLocaleDateString()}
              />
              {order.pickListId && (
                <div className="flex justify-between gap-4 py-2 sm:col-span-2">
                  <span className="text-sm text-muted-foreground">Pick List</span>
                  <button
                    onClick={() => navigate(`/pick-lists/${order.pickListId}`)}
                    className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    View Pick List #{order.pickListId.slice(-6)}
                    <ExternalLink className="size-3" />
                  </button>
                </div>
              )}
              <div className="sm:col-span-2">
                <InfoRow label="Notes" value={order.notes} />
              </div>
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
            {canEdit && (
              <Button
                className="w-full gap-2"
                variant="outline"
                onClick={() => navigate(`/orders/${order.id}/edit`)}
              >
                <Pencil className="size-4" />
                Edit Order
              </Button>
            )}

            {canGeneratePickList && (
              <Button
                className="w-full gap-2"
                onClick={() => generatePickListMutation.mutate()}
                disabled={generatePickListMutation.isPending}
              >
                {generatePickListMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Package className="size-4" />
                )}
                {generatePickListMutation.isPending
                  ? 'Generating...'
                  : 'Generate Pick List'}
              </Button>
            )}

            {canFulfill && (
              <Button
                className="w-full gap-2"
                onClick={() => fulfillMutation.mutate()}
                disabled={fulfillMutation.isPending}
              >
                {fulfillMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="size-4" />
                )}
                {fulfillMutation.isPending ? 'Fulfilling...' : 'Fulfill Order'}
              </Button>
            )}

            {canCancel && (
              <Button
                className="w-full gap-2"
                variant="destructive"
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <XCircle className="size-4" />
                )}
                {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Order'}
              </Button>
            )}

            <Separator />
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Created: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Updated: {new Date(order.updatedAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
