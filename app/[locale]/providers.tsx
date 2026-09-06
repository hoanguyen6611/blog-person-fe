"use client";

import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useSlowRequestStore } from "@/store/useSlowRequestStore";

// Sends/receives the backend's httpOnly visitor_id cookie (view tracking) cross-origin.
axios.defaults.withCredentials = true;

// Same "slow request" tracking as api/useswr/index.ts's fetchers, but for
// the axios calls (mostly POST/PUT/PATCH/DELETE) scattered across the app
// that don't go through those shared SWR fetchers.
const SLOW_THRESHOLD_MS = 4000;

type SlowMeta = { _slowTimer?: ReturnType<typeof setTimeout>; _markedSlow?: boolean };

axios.interceptors.request.use((config) => {
  const { markSlow } = useSlowRequestStore.getState();
  const meta = config as unknown as SlowMeta;
  meta._slowTimer = setTimeout(() => {
    meta._markedSlow = true;
    markSlow();
  }, SLOW_THRESHOLD_MS);
  return config;
});

const clearSlowFor = (config?: unknown) => {
  if (!config) return;
  const meta = config as SlowMeta;
  clearTimeout(meta._slowTimer);
  if (meta._markedSlow) {
    useSlowRequestStore.getState().clearSlow();
  }
};

axios.interceptors.response.use(
  (response) => {
    clearSlowFor(response.config);
    return response;
  },
  (error) => {
    clearSlowFor(error.config);
    return Promise.reject(error);
  }
);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
