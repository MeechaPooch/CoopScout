let statics =  [
  '/',
  '/file/style.css',
  '/file/script.js',
  '/file/state.js',
  '/file/input.js',
  '/file/manifest.json',
  '/file/fonts/gotham/Gotham-Bold.otf',
  '/img/coopscout_circle.png',
  '/img/coopscout.png',
  '/file/register-service-worker.js',
  '/file/qrcode.min.js',
]

self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('coopscout').then(function(cache) {
        return cache.addAll(
          statics
        );
      })
    );
  });

  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });