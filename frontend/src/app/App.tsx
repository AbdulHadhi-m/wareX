import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from '@/services/query-client';
import { ThemeProvider } from '@/components/common/theme-provider';
import { ErrorBoundary } from '@/components/common/error-boundary';
import { AuthInitializer } from '@/features/auth';
import { router } from '@/routes';

export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthInitializer />
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={4000}
          />
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
