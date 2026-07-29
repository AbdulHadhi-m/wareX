import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import type { NotificationType } from '../types';

interface NotificationTypeIconProps {
  type: NotificationType;
}

const typeConfig: Record<NotificationType, { icon: typeof CheckCircle2; className: string }> = {
  'Order Created': { icon: CheckCircle2, className: 'text-emerald-500' },
  'Order Fulfilled': { icon: CheckCircle2, className: 'text-emerald-500' },
  'Pick List Completed': { icon: CheckCircle2, className: 'text-emerald-500' },
  'Device Moved': { icon: CheckCircle2, className: 'text-emerald-500' },
  'Inventory Updated': { icon: CheckCircle2, className: 'text-emerald-500' },
  'Pick List Assigned': { icon: AlertTriangle, className: 'text-amber-500' },
  'Pick List Started': { icon: AlertTriangle, className: 'text-amber-500' },
  'Device Reserved': { icon: AlertTriangle, className: 'text-amber-500' },
  'Order Cancelled': { icon: XCircle, className: 'text-red-500' },
  'Pick List Cancelled': { icon: XCircle, className: 'text-red-500' },
  'System': { icon: Info, className: 'text-emerald-500' },
};

export function NotificationTypeIcon({ type }: NotificationTypeIconProps) {
  const config = typeConfig[type] ?? { icon: Info, className: 'text-emerald-500' };
  const Icon = config.icon;

  return (
    <div className="mt-0.5 shrink-0">
      <Icon className={cn('size-5', config.className)} />
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
