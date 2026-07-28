import { cn } from '@/lib/utils';
import { LoadingSpinner } from './loading-spinner';

interface LoadingOverlayProps {
  active: boolean;
  className?: string;
  label?: string;
}

export function LoadingOverlay({ active, className, label }: LoadingOverlayProps) {
  if (!active) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm',
        className,
      )}
    >
      <LoadingSpinner size="lg" label={label} />
    </div>
  );
}
