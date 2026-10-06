/* The Driveway — minimal service worker.
   Network-first so testers always get the latest build when online;
   cached page is only used as an offline fallback (no stale builds). */
const CACHE = 'driveway-shell';
self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(function (r) {
          var copy = r.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
          return r;
        })
        .catch(function () {
          return caches.match(e.request).then(function (m) { return m || caches.match('./'); });
        })
    );
  }
});
