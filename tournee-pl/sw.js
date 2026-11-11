/* Tournée PL : fonctionnement hors ligne.
   - L'application (HTML, icônes) est mise en cache à l'installation.
   - Polices et moteur de lecture de photo : gardés après le premier usage.
   - Adresses et communes (services publics) : toujours en direct, jamais en cache. */
const VERSION = 'tpl-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon.svg', './icons/icon-180.png', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png'];
const RUNTIME = 'tpl-runtime-v1';
const RUNTIME_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.jsdelivr.net', 'tessdata.projectnaptha.com'];
const LIVE_HOSTS = ['api-adresse.data.gouv.fr', 'geo.api.gouv.fr'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== RUNTIME).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (LIVE_HOSTS.includes(url.hostname)) return; // le navigateur gère : en direct
  if (url.origin === self.location.origin) {
    // page : réseau d'abord (dernière version), cache si hors ligne
    if (req.mode === 'navigate') {
      e.respondWith(fetch(req).then(r => { if (r.ok) { const cp = r.clone(); caches.open(VERSION).then(c => c.put('./index.html', cp)); } return r; })
        .catch(() => caches.match('./index.html', { ignoreSearch: true })));
      return;
    }
    // fichiers de l'app : cache tout de suite, mise à jour en arrière-plan
    e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => {
      const net = fetch(req).then(r => { if (r.ok) { const cp = r.clone(); caches.open(VERSION).then(c => c.put(req, cp)); } return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  if (RUNTIME_HOSTS.includes(url.hostname)) {
    e.respondWith(caches.open(RUNTIME).then(c => c.match(req).then(hit => hit || fetch(req).then(r => {
      if (r.ok || r.type === 'opaque') c.put(req, r.clone());
      return r;
    }))));
  }
});
