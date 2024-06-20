module.exports = {
    globDirectory: 'dist/',
    globPatterns: [
      '**/*.{html,js,css}'
    ],
    swDest: 'dist/service-worker.js',
    runtimeCaching: [
      {
        urlPattern: ({request}) => request.destination === 'document',
        handler: 'NetworkFirst',
        options: {
          cacheName: 'html-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60, // 1 day
          },
          networkTimeoutSeconds: 10, // fallback to cache if no network response in 10 seconds
        },
      },
      {
        urlPattern: ({request}) => request.destination === 'script' || request.destination === 'style',
        handler: 'NetworkFirst',
        options: {
          cacheName: 'asset-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60, // 1 day
          },
          networkTimeoutSeconds: 10, // fallback to cache if no network response in 10 seconds
        },
      },
      {
        urlPattern: ({request}) => request.destination === 'image',
        handler: 'CacheFirst',
        options: {
          cacheName: 'image-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
    ],
    cleanupOutdatedCaches: true,
  };
  