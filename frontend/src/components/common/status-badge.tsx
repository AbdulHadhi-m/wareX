import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusVariantMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'> = {
  active: 'success',
  available: 'success',
  fulfilled: 'success',
  completed: 'success',
  resolved: 'success',
  inactive: 'secondary',
  draft: 'secondary',
  pending: 'warning',
  reserved: 'warning',
  assigned: 'warning',
  picked: 'warning',
  shipping: 'warning',
  picking: 'warning',
  'in progress': 'warning',
  'in-progress': 'warning',
  shipped: 'success',
  blocked: 'destructive',
  cancelled: 'destructive',
  damaged: 'destructive',
  returned: 'destructive',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = statusVariantMap[status.toLowerCase()] ?? 'default';

  return (
    <Badge variant={variant} className={cn('capitalize', className)}>
      {status}
    </Badge>
  );
}
