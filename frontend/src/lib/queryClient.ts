import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,           // Never auto-stale
      gcTime: Infinity,               // Keep forever (React Query v5)
      refetchOnWindowFocus: false,   // Don't refetch on tab switch
      refetchOnMount: false,         // Use cache if available
      retry: 1,                      // Retry failed requests once
    },
    mutations: {
      retry: 1,
    },
  },
});
