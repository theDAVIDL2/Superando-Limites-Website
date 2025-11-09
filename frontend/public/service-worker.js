// Service Worker para cache agressivo e performance

const CACHE_NAME = 'superando-limites-v1';
const RUNTIME_CACHE = 'runtime-cache-v1';

// Assets para precache (críticos)
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/static/css/main.css',
  '/static/js/main.js',
];

// Install event - precache assets críticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - estratégia de cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Bypass SW for API calls and streaming (SSE) or non-GET to avoid latency
  // - Ensures AI assistant (SSE) and backend APIs are never cached/intercepted
  const acceptHeader = (request.headers && request.headers.get('accept')) || '';
  const isSse = acceptHeader.includes('text/event-stream');
  const isApi = url.pathname.startsWith('/api');
  if (isSse || isApi || request.method !== 'GET') {
    return; // let the network handle it directly
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) return;

  // Network-first para HTML (sempre fresh)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clonedResponse = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, clonedResponse);
          });
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first para imagens (long-term cache)
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(request).then((response) => {
          // Clone antes de cachear
          const clonedResponse = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, clonedResponse);
          });
          return response;
        });
      })
    );
    return;
  }

  // Stale-while-revalidate para CSS/JS
  if (request.destination === 'style' || request.destination === 'script') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((response) => {
          const clonedResponse = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, clonedResponse);
          });
          return response;
        });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Network-first para tudo mais
  event.respondWith(
    fetch(request)
      .then((response) => {
        const clonedResponse = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(request, clonedResponse);
        });
        return response;
      })
      .catch(() => caches.match(request))
  );
});

