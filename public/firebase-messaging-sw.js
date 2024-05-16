importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');
importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging-compat.js')
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
    { url: '/Ai.png', revision: '1' },
    { url: '/friendship.jpg', revision: '1' },
    { url: '/google.svg', revision: '1' },
    { url: '/load.gif', revision: '1' },
    { url: '/logo.png', revision: '1' },
    { url: '/offline.html', revision: '1' },
    { url: '/pg.css', revision: '1' },
    { url: '/pg2.css', revision: '1' }
  
  ]);
let config =  {
    apiKey: "AIzaSyDyY5F4FGDsL4al0PagVTFOZzZ0UDIY6Vw",
    authDomain: "friendsforever-9cc00.firebaseapp.com",
    projectId: "friendsforever-9cc00",
    storageBucket: "friendsforever-9cc00.appspot.com",
    messagingSenderId: "836167022374",
    appId: "1:836167022374:web:3d48a724d93b005b1af3e7",
    measurementId: "G-D18HLQN9MV"
}
const app = firebase.initializeApp(config)
const messaging = firebase.messaging()

