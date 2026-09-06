import { create } from "zustand";

type SlowRequestStore = {
  count: number;
  markSlow: () => void;
  clearSlow: () => void;
};

// Tracks requests that are taking unusually long (e.g. the backend waking up
// from Render's free-tier sleep). Every fetcher/interceptor that funnels
// through fetcherUseSWR/fetcherWithTokenUseSWR or the shared axios instance
// reports into this single counter, so one banner component can reflect
// "something is slow right now" for the whole app without each call site
// wiring up its own loading state.
export const useSlowRequestStore = create<SlowRequestStore>((set) => ({
  count: 0,
  markSlow: () => set((s) => ({ count: s.count + 1 })),
  clearSlow: () => set((s) => ({ count: Math.max(0, s.count - 1) })),
}));
