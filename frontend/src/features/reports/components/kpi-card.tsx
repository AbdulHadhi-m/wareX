import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  className?: string;
}

export function KpiCard({ label, value, icon, className }: KpiCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold tracking-tight">{value}</span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      </CardContent>
    </Card>
  );
}
