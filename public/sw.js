const STATIC_CACHE = "tech-news-static-v1";
const OFFLINE_URL = "/offline.html";

// Basic offline support: previously-visited pages and static assets still
// load with no network; anything never cached falls back to a static
// offline page. This deliberately does NOT try to cache API responses from
// NEXT_PUBLIC_API_URL (cross-origin, and the app fetches that data
// client-side after hydration) — offline browsing shows the last-cached
// page shell, not fresh data.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.add(OFFLINE_URL))
      .catch(() => {
        // offline.html missing is not fatal — just means no offline
        // fallback page until the next successful install.
      })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // never touch the API/Clerk/ImageKit

  // Page navigations: network-first so content is always fresh when
  // online, cached copy (or the offline page) only when the network fails.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          // Awaited (not fire-and-forget): the browser can terminate the SW
          // the instant respondWith()'s promise resolves, so if the cache
          // write isn't part of this chain it can get killed mid-write and
          // silently never persist.
          const cache = await caches.open(STATIC_CACHE);
          await cache.put(request, response.clone());
          return response;
        } catch {
          const cached = await caches.match(request);
          return cached || caches.match(OFFLINE_URL);
        }
      })()
    );
    return;
  }

  // Hashed, immutable build assets: cache-first.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        const cache = await caches.open(STATIC_CACHE);
        await cache.put(request, response.clone());
        return response;
      })()
    );
  }
});

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "Tech News", body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "Tech News";
  const options = {
    body: data.body || data.message || "",
    icon: data.icon || "/icon-192.png",
    badge: "/icon-192.png",
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === url && "focus" in client) return client.focus();
        }
        if (self.clients.openWindow) return self.clients.openWindow(url);
      })
  );
});
