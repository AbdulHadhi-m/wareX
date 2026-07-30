import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type KpiVariant = 'indigo' | 'emerald' | 'amber' | 'blue' | 'purple' | 'rose' | 'slate';

interface KpiCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  variant?: KpiVariant;
  subtitle?: string;
  className?: string;
}

const variantStyles: Record<
  KpiVariant,
  { iconBg: string; iconText: string; badgeBg: string; borderHover: string }
> = {
  indigo: {
    iconBg: 'bg-indigo-500/10 dark:bg-indigo-400/10',
    iconText: 'text-indigo-600 dark:text-indigo-400',
    badgeBg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300',
    borderHover: 'hover:border-indigo-500/30',
  },
  emerald: {
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-400/10',
    iconText: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    borderHover: 'hover:border-emerald-500/30',
  },
  amber: {
    iconBg: 'bg-amber-500/10 dark:bg-amber-400/10',
    iconText: 'text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
    borderHover: 'hover:border-amber-500/30',
  },
  blue: {
    iconBg: 'bg-blue-500/10 dark:bg-blue-400/10',
    iconText: 'text-blue-600 dark:text-blue-400',
    badgeBg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
    borderHover: 'hover:border-blue-500/30',
  },
  purple: {
    iconBg: 'bg-purple-500/10 dark:bg-purple-400/10',
    iconText: 'text-purple-600 dark:text-purple-400',
    badgeBg: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300',
    borderHover: 'hover:border-purple-500/30',
  },
  rose: {
    iconBg: 'bg-rose-500/10 dark:bg-rose-400/10',
    iconText: 'text-rose-600 dark:text-rose-400',
    badgeBg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300',
    borderHover: 'hover:border-rose-500/30',
  },
  slate: {
    iconBg: 'bg-slate-500/10 dark:bg-slate-400/10',
    iconText: 'text-slate-600 dark:text-slate-400',
    badgeBg: 'bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300',
    borderHover: 'hover:border-slate-500/30',
  },
};

export function KpiCard({
  label,
  value,
  icon,
  variant = 'indigo',
  subtitle,
  className,
}: KpiCardProps) {
  const style = variantStyles[variant] ?? variantStyles.indigo;

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-border/60 bg-card/80 backdrop-blur-sm',
        style.borderHover,
        className,
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {value}
              </span>
              {subtitle && (
                <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full', style.badgeBg)}>
                  {subtitle}
                </span>
              )}
            </div>
          </div>
          <div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
              style.iconBg,
              style.iconText,
            )}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
