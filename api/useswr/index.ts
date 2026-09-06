import { useSlowRequestStore } from "@/store/useSlowRequestStore";

// If the backend is waking up from sleep (Render free tier), a normal
// request can take 20-30s+ instead of the usual <1s. Rather than each of
// the dozens of useSWR call sites showing its own generic spinner (or
// nothing), every fetch funnels through here, and anything still pending
// past this threshold flips a shared "something is slow" flag the whole
// app can react to (see components/SlowRequestBanner.tsx).
const SLOW_THRESHOLD_MS = 4000;

function withSlowDetection<T>(promise: Promise<T>): Promise<T> {
  const { markSlow, clearSlow } = useSlowRequestStore.getState();
  let markedSlow = false;
  const timer = setTimeout(() => {
    markedSlow = true;
    markSlow();
  }, SLOW_THRESHOLD_MS);

  return promise.finally(() => {
    clearTimeout(timer);
    if (markedSlow) clearSlow();
  });
}

export const fetcherWithTokenUseSWR = (url: string, token: string) =>
  withSlowDetection(
    fetch(url, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    })
  );

export const fetcherUseSWR = (url: string) =>
  withSlowDetection(
    fetch(url, { credentials: "include" }).then((res) => res.json())
  );
