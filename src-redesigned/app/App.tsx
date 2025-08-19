import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/shared/components/ui/toaster';
import { Sonner } from '@/shared/components/ui/sonner';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import { AppErrorBoundary } from '@/shared/components/error-boundary/AppErrorBoundary';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { AppRouter } from './AppRouter';

// Configure React Query client with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <BrowserRouter>
              <AppRouter />
              <Toaster />
              <Sonner />
            </BrowserRouter>
            {process.env.NODE_ENV === 'development' && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
};

export default App;