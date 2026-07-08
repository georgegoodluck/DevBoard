import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Set the stale time for all queries to 1 minute
      staleTime: 1000 * 60,
      //   Don't refetch queries when the window is focused
      refetchOnWindowFocus: false,
      //   Retry failed request once
      retry: 1,
    },
  },
});
