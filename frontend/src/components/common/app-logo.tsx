import { cn } from '@/lib/utils';

interface AppLogoProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export function AppLogo({ className, variant = 'default' }: AppLogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
        W
      </div>
      {variant === 'default' && (
        <span className="font-semibold text-foreground tracking-tight">wareX</span>
      )}
    </div>
  );
}
