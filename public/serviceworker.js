const version = '1.0.0'

/**
 * Install event: caches essential assets for offline usage.
 */
self.addEventListener('install', event => {
  console.log('ServiceWorker: Installed version ', version)
  /**
   * Opens a cache and adds core assets.
   *
   * @async
   * @returns {Promise<void>} Resolves when all files are cached
   */
  const cacheAssets = async () => {
    const cache = await self.caches.open(version)
    console.log('ServiceWorker: Caching Files')

    return cache.addAll([
      'index.html',
      'styles/style.css'
    ])
  }
  event.waitUntil(cacheAssets())
})

/**
 * Activate event: cleans up old caches.
 */
self.addEventListener('activate', event => {
  console.log('ServiceWorker: Activated version ', version)

  /**
   * Deletes all caches that are not the current version.
   *
   * @async
   * @returns {Promise<void>} Resolves when old cache are removed
   */
  const cleanUp = async () => {
    const keys = await caches.keys()

    await Promise.all(
      keys
        .filter(key => key !== version)
        .map(key => caches.delete(key))
    )
  }
  event.waitUntil(cleanUp())
})

/**
 * Fetch wrapper that serves cached content first, falls back to network.
 * Only handles GET request for same-origin resources.
 *
 * @async
 * @param {Request} request -The feth request
 * @returns {Promise<Response>} The response from cache or network
 */
const cachedFetch = async request => {
  if (request.method !== 'GET') return fetch(request)

  const url = new URL(request.url)

  if (url.origin !== self.location.origin) return fetch(request)

  const cachedResponse = await caches.match(request)
  if (cachedResponse) return cachedResponse

  try {
    const response = await fetch(request)
    const cache = await caches.open(version)
    cache.put(request, response.clone())

    return response
  } catch (error) {
    console.error('ServiceWorker: Serving cache result')
    return caches.match(request)
  }
}

/**
 * Fetch event: intercepts request and responds with cachedFetch.
 */
self.addEventListener('fetch', event => {
  console.log('ServiceWorker: Fetching')

  event.respondWith(cachedFetch(event.request))
})

self.addEventListener('notificationclick', event => {
  event.notification.close()

  event.waitUntil(clients.openWindow('/'))
})

/**
 * Message event: handle messages sent from the main application.
 */
self.addEventListener('message', event => {
  console.log('ServiceWorker: Got a message')
  // TODO: Handle events from the main application
})

/**
 * Push-event: handles push-notifications from the server.
 */
self.addEventListener('push', event => {
  console.log('ServiceWorker: Got a push message from the server')
  // TODO: Show a notification for the user
})
