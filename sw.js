const CACHE_NAME = 'gems-pwa-cache-v83';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/components/theme.css',
  '/js/modules/state.js',
  '/js/modules/data.js',
  '/js/modules/ui-utils.js',
  '/js/modules/theme.js',
  '/js/modules/quiz.js',
  '/js/modules/dictionary.js',
  '/js/modules/audio.js',
  '/js/modules/nav.js',
  '/js/modules/reader.js',
  '/js/modules/shop.js',
  '/js/app.js'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Force the waiting service worker to become the active service worker.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const isPageRequest = event.request.destination === 'document' || event.request.mode === 'navigate';

  if (isPageRequest) {
    // Strategy: Network-First for HTML page requests to avoid getting stuck in old cache
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  } else {
    // Strategy: Stale-While-Revalidate for static assets
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        }).catch(() => {
          return cachedResponse;
        });
        return cachedResponse || fetchPromise;
      })
    );
  }
});
