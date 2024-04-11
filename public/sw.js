importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

workbox.routing.registerRoute(
  // Match HTML, CSS, JavaScript, images, and videos
  ({ url }) => url.pathname.match(/^(.*)\.(html|css|js|png|jpg|gif|svg|mp4|webm|ogg)$/i),
  new workbox.strategies.NetworkFirst({
    cacheName: 'network-first-cache',
  })
);

// Cache all other resources
workbox.routing.registerRoute(
  ({ url }) => !url.pathname.match(/^(.*)\.(html|css|js|png|jpg|gif|svg|mp4|webm|ogg)$/i),
  new workbox.strategies.CacheOnly({
    cacheName: 'cache-only-cache',
  })
);

// Precache app resources
workbox.precaching.precacheAndRoute([
  // List of resources to precache
  { url: '/', revision: '1' },
  { url: '/index.html', revision: '1' },
  { url: '/style.css', revision: '1' },
  { url: '/app.js', revision: '1' },
  { url: '/images/logo.png', revision: '1' },
  { url: '/video.mp4', revision: '1' },
]);
