importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

workbox.routing.registerRoute(
  // Match HTML, CSS, JavaScript, images, and videos
  ({ url }) => url.pathname.match(/^(.*)\.(html|css|js|png|jpg|gif|svg|mp4|webm|ogg)$/i),
  new workbox.strategies.NetworkFirst({
    cacheName: 'network-first-cache',
  })
);


// Precache app resources
workbox.precaching.precacheAndRoute([
  // List of resources to precache
  { url: '/', revision: '1' },
  { url: '/index.html', revision: '1' },
  { url: '/Ai.png', revision: '1' },
  { url: '/friendship.jpg', revision: '1' },
  { url: '/google.svg', revision: '1' },
  { url: '/load.gif', revision: '1' },
  { url: '/logo.png', revision: '1' },
  { url: '/offline.html', revision: '1' },
  { url: '/pg.css', revision: '1' },
  { url: '/pg2.css', revision: '1' }

]);
