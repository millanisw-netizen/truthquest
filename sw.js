/* ═══════════════════════════════════════════════════════════════
   sw.js — Service Worker (offline PWA support)
   TruthQuest | UNESCO Youth Hackathon 2026
   Caches all game assets so the game works without internet.
   Critical for UNESCO's low-connectivity regions goal.
═══════════════════════════════════════════════════════════════ */

const CACHE_NAME  = 'truthquest-v4';
const CACHE_FIRST = [
  '/',
  '/index.html',
  '/hub.html',
  '/game.html',
  '/investigation.html',
  '/factcheck.html',
  '/aidetection.html',
  '/sourceanalysis.html',
  '/social.html',
  '/academy.html',
  '/evidence.html',
  '/leaderboard.html',
  '/impact.html',
  '/404.html',
  '/css/main.css',
  '/css/game.css',
  '/css/platform.css',
  '/js/platform.js',
  '/js/nav.js',
  '/js/story-data.js',
  '/js/city.js',
  '/js/verifier.js',
  '/js/ui.js',
  '/js/engine.js',
  '/data/story.json',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap'
];

// ── Install: pre-cache all core assets ──────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHE_FIRST).catch(err => {
        console.warn('[SW] Pre-cache partial failure (ok on first install):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: clean up old caches ───────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first strategy ─────────────────────────────────
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        // Cache valid responses (not opaque, not errors)
        if (response && response.status === 200 && response.type !== 'opaque') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback for navigation requests
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
