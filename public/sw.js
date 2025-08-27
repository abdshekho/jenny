const CACHE_NAME = "jenny-menu-v1"
const STATIC_CACHE = "jenny-static-v1"
const IMAGE_CACHE = "jenny-images-v1"
const API_CACHE = "jenny-api-v1"

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/admin",
  "/manifest.json",
  "/offline.html",
  // Add other critical routes
]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...")

  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches
        .open(STATIC_CACHE)
        .then((cache) => {
          console.log("[SW] Caching static assets")
          return cache.addAll(STATIC_ASSETS)
        }),
      // Skip waiting to activate immediately
      self.skipWaiting(),
    ]),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...")

  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches
        .keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              if (
                cacheName !== CACHE_NAME &&
                cacheName !== STATIC_CACHE &&
                cacheName !== IMAGE_CACHE &&
                cacheName !== API_CACHE
              ) {
                console.log("[SW] Deleting old cache:", cacheName)
                return caches.delete(cacheName)
              }
            }),
          )
        }),
      // Take control of all clients
      self.clients.claim(),
    ]),
  )
})

// Fetch event - handle all network requests
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle different types of requests
  if (request.method !== "GET") {
    return // Only handle GET requests
  }

  // Handle API requests
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(handleApiRequest(request))
    return
  }

  // Handle image requests
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request))
    return
  }

  // Handle static assets
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticRequest(request))
    return
  }

  // Handle navigation requests
  if (request.mode === "navigate") {
    event.respondWith(handleNavigationRequest(request))
    return
  }

  // Default: network first, then cache
  event.respondWith(handleDefaultRequest(request))
})

// Handle API requests - Network first, cache fallback
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE)

  try {
    console.log("[SW] Fetching API from network:", request.url)
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      // Cache successful responses
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.log("[SW] Network failed for API, trying cache:", request.url)
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    // Return offline response for API
    return new Response(
      JSON.stringify({
        error: "Offline",
        message: "This content is not available offline",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

// Handle image requests - Cache first, network fallback
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE)
  const cachedResponse = await cache.match(request)

  if (cachedResponse) {
    console.log("[SW] Serving image from cache:", request.url)
    return cachedResponse
  }

  try {
    console.log("[SW] Fetching image from network:", request.url)
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      // Cache the image
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.log("[SW] Failed to fetch image:", request.url)

    // Return placeholder image for failed requests
    return new Response(
      `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0fdf4"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#15803d">
          Image unavailable offline
        </text>
      </svg>`,
      {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "no-cache",
        },
      },
    )
  }
}

// Handle static assets - Cache first, network fallback
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE)
  const cachedResponse = await cache.match(request)

  if (cachedResponse) {
    console.log("[SW] Serving static asset from cache:", request.url)
    return cachedResponse
  }

  try {
    console.log("[SW] Fetching static asset from network:", request.url)
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.log("[SW] Failed to fetch static asset:", request.url)
    throw error
  }
}

// Handle navigation requests - Network first, cache fallback, offline page
async function handleNavigationRequest(request) {
  try {
    console.log("[SW] Fetching navigation from network:", request.url)
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.log("[SW] Network failed for navigation, trying cache:", request.url)

    const cache = await caches.open(CACHE_NAME)
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    // Return offline page
    const offlineResponse = await cache.match("/offline.html")
    if (offlineResponse) {
      return offlineResponse
    }

    // Fallback offline response
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Offline - Jenny's Burger Menu</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: system-ui, sans-serif; 
              text-align: center; 
              padding: 2rem;
              background: #f0fdf4;
              color: #374151;
            }
            .container {
              max-width: 400px;
              margin: 0 auto;
              padding: 2rem;
              background: white;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .icon { font-size: 4rem; margin-bottom: 1rem; }
            h1 { color: #15803d; margin-bottom: 1rem; }
            button {
              background: #15803d;
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 4px;
              cursor: pointer;
              margin-top: 1rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">🍽️</div>
            <h1>You're Offline</h1>
            <p>Please check your internet connection and try again.</p>
            <button onclick="window.location.reload()">Try Again</button>
          </div>
        </body>
      </html>`,
      {
        headers: { "Content-Type": "text/html" },
      },
    )
  }
}

// Handle default requests - Network first, cache fallback
async function handleDefaultRequest(request) {
  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    const cache = await caches.open(CACHE_NAME)
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    throw error
  }
}

// Helper functions
function isImageRequest(request) {
  return request.destination === "image" || /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(new URL(request.url).pathname)
}

function isStaticAsset(request) {
  const url = new URL(request.url)
  return (
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/static/") ||
    /\.(js|css|woff|woff2|ttf|eot)$/i.test(url.pathname)
  )
}

// Background sync for when connection is restored
self.addEventListener("sync", (event) => {
  console.log("[SW] Background sync triggered:", event.tag)

  if (event.tag === "menu-sync") {
    event.waitUntil(syncMenuData())
  }
})

// Sync menu data when connection is restored
async function syncMenuData() {
  try {
    console.log("[SW] Syncing menu data...")
    const response = await fetch("/api/menu")

    if (response.ok) {
      const cache = await caches.open(API_CACHE)
      await cache.put("/api/menu", response.clone())
      console.log("[SW] Menu data synced successfully")

      // Notify clients about the update
      const clients = await self.clients.matchAll()
      clients.forEach((client) => {
        client.postMessage({
          type: "MENU_UPDATED",
          data: "Menu data has been updated",
        })
      })
    }
  } catch (error) {
    console.error("[SW] Failed to sync menu data:", error)
  }
}

// Handle push notifications (for future use)
self.addEventListener("push", (event) => {
  console.log("[SW] Push notification received")

  const options = {
    body: event.data ? event.data.text() : "New menu items available!",
    icon: "/icon.png",
    badge: "/icon.png",
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "View Menu",
        icon: "/icon.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icon.png",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification("Jenny's Burger Menu", options))
})

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked:", event.action)

  event.notification.close()

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"))
  }
})

console.log("[SW] Service worker loaded successfully")
