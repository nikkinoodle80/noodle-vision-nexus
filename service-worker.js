/**
 * NOODLE-VISION SERVICE WORKER
 * Enables offline functionality and PWA installation
 * Works on: Desktop, Mobile, VR, AR devices
 */

const CACHE_NAME = 'noodle-vision-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activated');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip WebSocket requests
  if (request.url.startsWith('ws://') || request.url.startsWith('wss://')) {
    return;
  }
  
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cached response if found
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Otherwise, fetch from network
      return fetch(request).then((networkResponse) => {
        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        
        return networkResponse;
      }).catch(() => {
        // If offline and HTML request, return offline page
        if (request.headers.get('accept').includes('text/html')) {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-mcp-console') {
    console.log('🔄 Syncing MCP console data...');
    event.waitUntil(syncMCPConsole());
  }
});

async function syncMCPConsole() {
  // Sync queued MCP messages when back online
  const cache = await caches.open('mcp-queue');
  const requests = await cache.keys();
  
  for (const request of requests) {
    try {
      await fetch(request);
      await cache.delete(request);
    } catch (error) {
      console.error('Failed to sync:', error);
    }
  }
}

// Push notifications (for caretaker alerts)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'New notification from Noodle-Vision',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [200, 100, 200],
    tag: 'noodle-vision',
    requireInteraction: data.priority === 'high',
    data: data,
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Noodle-Vision', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handler (from main app)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'EMERGENCY_ALERT') {
    // Handle emergency alert
    self.registration.showNotification('🚨 EMERGENCY ALERT', {
      body: 'Emergency button pressed!',
      requireInteraction: true,
      vibrate: [300, 100, 300, 100, 300],
      tag: 'emergency',
      priority: 'high',
    });
  }
});

console.log('🚀 Service Worker loaded');
