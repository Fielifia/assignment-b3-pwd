const version = '1.0.0'

self.addEventListener('install', event => {
    console.log('ServiceWorker: Installed version ', version)
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

self.addEventListener('activate', event => {
    console.log('ServiceWorker: Activated version ', version)
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

const cachedFetch = async request => {
    if(request.method !== 'GET') return fetch(request)

        const url = new URL(request.url)

        if(url.origin !== self.location.origin) return fetch(request)

        const cachedResponse = await caches.match(request)
        if(cachedResponse) return cachedResponse

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

self.addEventListener('fetch', event => {
        console.log('ServiceWorker: Fetching')

    event.respondWith(cachedFetch(event.request))
})

self.addEventListener('message', event => {
    console.log('ServiceWorker: Got a message')
    // TODO: Handle events from the main application
})

self.addEventListener('push', event => {
    console.log('ServiceWorker: Got a push message from the server')
    // TODO: Show a notification for the user
})
