// PaviaLAB – praca offline: wszystkie pliki aplikacji są zapisywane w pamięci telefonu.
const CACHE = 'pavialab-v0.08';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-32.png', './icon-192.png', './icon-512.png', './maskable-192.png', './maskable-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim())); });
// Najpierw sieć (żeby po aktualizacji szybko pojawiła się nowa wersja), a bez internetu – kopia z pamięci.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html'))));
});
