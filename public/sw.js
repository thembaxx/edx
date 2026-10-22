/* Kinlo demo offline shell. No school or personal API response caching. */
const CACHE_NAME = "kinlo-public-demo-v3";
const OFFLINE_SHELL = [
  "/",
  "/logo.svg",
  "/favicon.svg",
  "/manifest.webmanifest",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys
              .filter(
                (key) =>
                  (key.startsWith("edx-public-demo-") || key.startsWith("kinlo-public-demo-")) &&
                  key !== CACHE_NAME,
              )
              .map((key) => caches.delete(key)),
          ),
        ),
      self.clients.claim(),
    ]),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "PREFETCH_DEMO_SHELL" || !Array.isArray(event.data.assets)) return;
  const files = event.data.assets
    .filter((item) => typeof item === "string")
    .slice(0, 120)
    .filter((item) => {
      try {
        const url = new URL(item);
        return url.origin === self.location.origin && url.pathname.startsWith("/_next/static/");
      } catch {
        return false;
      }
    });
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => Promise.allSettled(files.map((url) => cache.add(url)))),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && url.pathname === "/" && response.type === "basic") {
            const copy = response.clone();
            event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put("/", copy)));
          }
          return response;
        })
        .catch(async () => (await caches.match("/")) ?? Response.error()),
    );
    return;
  }

  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    ["/logo.svg", "/favicon.svg", "/manifest.webmanifest", "/apple-touch-icon.png"].includes(
      url.pathname,
    )
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((response) => {
            if (response.ok && response.type === "basic") {
              const copy = response.clone();
              event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)));
            }
            return response;
          }),
      ),
    );
  }
});
