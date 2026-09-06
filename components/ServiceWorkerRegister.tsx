"use client";
import { useEffect } from "react";

// Registers the service worker unconditionally (basic offline caching, see
// public/sw.js) — separate from usePushNotifications.ts, which only
// registers it when a user opts into push. register() with the same URL is
// idempotent, so having both call sites is safe.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Offline support is a nice-to-have — never surface this to the user.
    });
  }, []);

  return null;
}
