import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ErrorState } from '@/components/common/error-state';
import { EmptyState } from '@/components/common/empty-state';

interface ChartCardProps {
  title: string;
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  onRetry?: () => void;
  isEmpty?: boolean;
  isEmptyMessage?: string;
  children: ReactNode;
}

export function ChartCard({
  title,
  isLoading,
  isError,
  error,
  onRetry,
  isEmpty,
  isEmptyMessage = 'No data available',
  children,
}: ChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : isError ? (
          <ErrorState
            title="Failed to load"
            message={error?.message ?? ''}
            onRetry={onRetry}
          />
        ) : isEmpty ? (
          <EmptyState title={isEmptyMessage} />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
