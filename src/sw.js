import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json()
    console.log('Attempting to show notification:', data)

    event.waitUntil(
      (async () => {
        const clients = await self.clients.matchAll()
        clients.forEach((client) => client.postMessage(data))

        await self.registration.showNotification(data.title, {
          body: data.body,
          icon: '/icon.png',
        })
      })()
    )
  }
})
