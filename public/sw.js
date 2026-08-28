const CACHE = 'touch-drills-v1';
const SHELL = ['/', '/index.html', '/offline.html', '/manifest.webmanifest', '/icon.svg', '/assets/app.js', '/assets/index.css', '/assets/cassette-drill.webp'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL))));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('message', event => { if (event.data === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const request = event.request;
  event.respondWith(caches.match(request).then(hit => hit || fetch(request).then(response => {
    if (response.ok && new URL(request.url).origin === location.origin) { const copy=response.clone(); caches.open(CACHE).then(cache => cache.put(request, copy)); }
    return response;
  }).catch(() => request.mode === 'navigate' ? caches.match('/offline.html') : caches.match(request))));
});
