/* edx demo service worker: same-origin app shell and immutable static assets only. */
const VERSION = "edx-shell-v1";
const SHELL = ["/", "/og.svg"];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key)))),
    self.clients.claim(),
  ]));
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then((response) => {
      if (response.ok && response.type === "basic") {
        const copy = response.clone();
        void caches.open(VERSION).then((cache) => cache.put("/", copy));
      }
      return response;
    }).catch(async () => (await caches.match("/")) || Response.error()));
    return;
  }
  if (/^\/_next\/static\//.test(url.pathname) || /\.(?:js|css|svg|png|woff2)$/.test(url.pathname)) {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok && response.type === "basic") {
        const copy = response.clone();
        void caches.open(VERSION).then((cache) => cache.put(request, copy));
      }
      return response;
    })));
  }
});
