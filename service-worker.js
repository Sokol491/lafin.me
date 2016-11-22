var cacheName = 'lafin-v1';
var filesToCache = [
  '/',
  '/dist/style.css',
  '/dist/bundle.js',
  '/dist/vendor.bundle.js',
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    }).catch(function(error) {
      console.error('Adding to cache failed with ' + error);
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response) {
        return response;
      } else {
        return fetch(e.request).then(function(response) {
          return caches.open(cacheName).then(function(cache) {
            cache.put(e.request.url, response.clone()).catch(function(error) {
              console.error('Put the cache failed with ' + error);
            });
            return response;
          });
        }).catch(function(error) {
          console.error('Fetch data failed with ' + error);
        });
      }
    })
  );
});