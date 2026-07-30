import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  onRetry?: () => void;
  isEmpty?: boolean;
  isEmptyMessage?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function ChartCard({
  title,
  subtitle,
  isLoading,
  isError,
  error,
  onRetry,
  isEmpty,
  isEmptyMessage = 'No data available',
  action,
  children,
}: ChartCardProps) {
  return (
    <Card className="overflow-hidden border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-5 px-6 border-b border-border/40">
        <div>
          <CardTitle className="text-base font-semibold text-foreground tracking-tight">{title}</CardTitle>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        {action}
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner size="md" />
          </div>
        ) : isError ? (
          <ErrorState
            title="Failed to load chart"
            message={error?.message ?? ''}
            onRetry={onRetry}
          />
        ) : isEmpty ? (
          <div className="py-8">
            <EmptyState title={isEmptyMessage} description="Data will appear once records are available." />
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
