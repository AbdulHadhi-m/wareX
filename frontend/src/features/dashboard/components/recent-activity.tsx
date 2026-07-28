import { FileText, ClipboardList, Bell, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRecentOrders, useRecentPickLists, useRecentNotifications } from '../hooks/use-dashboard';
import type { OrderItem, PickListItem, NotificationItem } from '../types';

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function statusVariant(status: string) {
  const s = status.toLowerCase();
  if (s === 'fulfilled' || s === 'completed' || s === 'available') return 'success' as const;
  if (s === 'cancelled' || s === 'damaged') return 'destructive' as const;
  if (s === 'pending' || s === 'inprogress' || s === 'in progress') return 'warning' as const;
  return 'secondary' as const;
}

function OrderItemRow({ order }: { order: OrderItem }) {
  return (
    <div className="flex items-center justify-between gap-2 py-2">
      <div className="flex items-center gap-2 min-w-0">
        <FileText className="size-4 shrink-0 text-muted-foreground" />
        <span className="text-sm truncate">{order.orderNumber}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant={statusVariant(order.status)} className="text-[10px] px-1.5 py-0">
          {order.status}
        </Badge>
        <span className="text-xs text-muted-foreground">{timeAgo(order.createdAt)}</span>
      </div>
    </div>
  );
}

function PickListItemRow({ pickList }: { pickList: PickListItem }) {
  return (
    <div className="flex items-center justify-between gap-2 py-2">
      <div className="flex items-center gap-2 min-w-0">
        <ClipboardList className="size-4 shrink-0 text-muted-foreground" />
        <span className="text-sm truncate">{pickList.pickListNumber}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant={statusVariant(pickList.status)} className="text-[10px] px-1.5 py-0">
          {pickList.status}
        </Badge>
        <span className="text-xs text-muted-foreground">{timeAgo(pickList.createdAt)}</span>
      </div>
    </div>
  );
}

function NotificationItemRow({ notification }: { notification: NotificationItem }) {
  return (
    <div className="flex items-start gap-2 py-2">
      <Bell className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-sm truncate">{notification.title}</p>
        <p className="text-xs text-muted-foreground truncate">{notification.message}</p>
      </div>
      <span className="text-xs text-muted-foreground shrink-0">{timeAgo(notification.createdAt)}</span>
    </div>
  );
}

function ActivityCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        {icon}
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0 divide-y">{children}</CardContent>
    </Card>
  );
}

function ActivityListContent<T>({
  items,
  renderItem,
  isLoading,
  emptyLabel,
}: {
  items: T[] | undefined;
  renderItem: (item: T) => React.ReactNode;
  isLoading: boolean;
  emptyLabel: string;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return <p className="py-4 text-center text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return <>{items.map((item, i) => <div key={i}>{renderItem(item)}</div>)}</>;
}

export function RecentActivity() {
  const orders = useRecentOrders(5);
  const pickLists = useRecentPickLists(5);
  const notifications = useRecentNotifications(5);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <ActivityCard title="Recent Orders" icon={<FileText className="size-4 text-muted-foreground" />}>
        <ActivityListContent
          items={orders.data}
          renderItem={(item) => <OrderItemRow order={item} />}
          isLoading={orders.isLoading}
          emptyLabel="No recent orders"
        />
      </ActivityCard>

      <ActivityCard title="Recent Pick Lists" icon={<ClipboardList className="size-4 text-muted-foreground" />}>
        <ActivityListContent
          items={pickLists.data}
          renderItem={(item) => <PickListItemRow pickList={item} />}
          isLoading={pickLists.isLoading}
          emptyLabel="No recent pick lists"
        />
      </ActivityCard>

      <ActivityCard title="Recent Notifications" icon={<Bell className="size-4 text-muted-foreground" />}>
        <ActivityListContent
          items={notifications.data}
          renderItem={(item) => <NotificationItemRow notification={item} />}
          isLoading={notifications.isLoading}
          emptyLabel="No recent notifications"
        />
      </ActivityCard>
    </div>
  );
}
