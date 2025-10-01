import { precacheAndRoute } from 'workbox-precaching'

// Precache tất cả các file được build
precacheAndRoute(self.__WB_MANIFEST)

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  event.waitUntil(self.clients.claim())
})

// Push notification handler
self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json()
    console.log('Push notification received:', data)

    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage(data)
      })
    })

    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/icon.png',
        badge: '/icon.png',
        vibrate: [200, 100, 200],
        data: data,
      })
    )
  }
})

// Notification click handler
self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received.')
  event.notification.close()

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      // Nếu có tab đang mở, focus vào đó
      for (const client of clients) {
        if (client.url === 'https://td3unitee.io.vn/' && 'focus' in client) {
          return client.focus()
        }
      }
      // Nếu không có tab nào, mở tab mới
      if (self.clients.openWindow) {
        return self.clients.openWindow('https://td3unitee.io.vn/')
      }
    })
  )
})
