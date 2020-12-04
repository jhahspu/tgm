const cacheName = 'tgm-v1.0.0';
const staticAssets = [
  '../../index.html',
  '../../manifest.webmanifest',
  '../css/style.min.css',
  './glide.min.js',
  './index.js',
  './movie-card.js'
];

// Cache static files
self.addEventListener('install', async e => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

// Tell sw to start servicing the running app immediatly
self.addEventListener('activate', e => {
  self.clients.claim();
});

// Check for data in cache otherwise get from network
self.addEventListener('fetch', async e => {
  const req = e.request;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkAndCache(req));
  }
});

// Open old cache and match the request and return else get from network
async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  return cached || fetch(req);
}

// If network available put new version into cache, else fallback to old
async function networkAndCache(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached;
  }
}