"use client";
import { useEffect } from "react";

// Registers the service worker unconditionally in production (basic offline
// caching, see public/sw.js) — separate from usePushNotifications.ts, which
// only registers it when a user opts into push. register() with the same
// URL is idempotent, so having both call sites is safe.
//
// Skipped entirely in development: sw.js's cache-first handling of
// "/_next/static/" assumes those filenames are content-hashed, which is
// only true for a production build. In dev mode Next.js reuses the same
// stable chunk paths across every recompile, so once the SW caches one it
// keeps serving that old version after a Fast Refresh — the exact "stale
// between versions" confusion this caused repeatedly during local testing.
// Any SW a previous dev session already registered is actively torn down
// so it stops intercepting requests too.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }
    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => registration.unregister());
      });
      return;
    }
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Offline support is a nice-to-have — never surface this to the user.
    });
  }, []);

  return null;
}
