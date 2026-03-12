"use client";

import type { ReactNode } from "react";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AxiosError } from "axios";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { useState } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/stores/useAuthStore";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => {
    return new QueryClient({
      queryCache: new QueryCache({
        onError: (error: Error) => {
          if (error instanceof AxiosError && error.response?.status === 401) {
            const authStore = useAuthStore.getState();
            authStore.setJwtToken(null);
            authStore.setHasAcceptedTerms(false);
            window.location.href = "/login";
          }
        },
      }),
      defaultOptions: {
        queries: {
          retry: false,
          refetchOnWindowFocus: false,
        },
      },
    });
  });

  return (
    <NuqsAdapter>
      <TooltipProvider delayDuration={0}>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-left"
          />
        </QueryClientProvider>
      </TooltipProvider>
    </NuqsAdapter>
  );
}
