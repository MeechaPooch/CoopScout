self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('coopscout').then(function(cache) {
        return cache.addAll(
          [
            '/',
            '/file/style.css',
            '/file/script.js',
            '/file/state.js',
            '/file/input.js',
            '/file/manifest.json',
            '/file/fonts/gotham/Gotham-Bold.otf'
          ]
        );
      })
    );
  });

  self.addEventListener('fetch', function(event) {
    event.respondWith(
      fetch(event.request).catch(function() {
        return caches.match(event.request);
      })
    );
  });