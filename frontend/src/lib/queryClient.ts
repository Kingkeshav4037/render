import { QueryClient } from '@tanstack/react-query';

// HTTP status codes that should NOT trigger a retry
const NO_RETRY_STATUS_CODES = [
  400, // Bad Request
  401, // Unauthorized
  403, // Forbidden
  404, // Not Found
  422, // Unprocessable Entity
];

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes fresh data window
      gcTime: 15 * 60 * 1000,   // 15 minutes inactive garbage collection cache
      refetchOnWindowFocus: false, // Prevent redundant background network requests on tab switch
      refetchOnReconnect: true,
      retry: (failureCount, error: any) => {
        // Stop retrying after 3 attempts
        if (failureCount >= 3) return false;
        
        // Don't retry on specific client errors
        const status = error?.status || error?.statusCode;
        if (status && NO_RETRY_STATUS_CODES.includes(status)) {
          return false;
        }
        
        // Supabase specific: Don't retry auth token errors (usually 400s/401s, but could manifest differently)
        if (error?.message?.includes('JWT') || error?.message?.includes('token')) {
          return false;
        }

        // Retry network errors or 5xx
        return true;
      },
    },
    mutations: {
      retry: false, // Generally don't retry mutations
    }
  },
});
