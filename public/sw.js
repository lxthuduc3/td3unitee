self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data

    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage(data)
      })
    })

    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/icon.png',
      })
    )
  }
})

self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received.')
  event.notification.close()
  event.waitUntil(clients.openWindow('https://td3unitee.vercel.app'))
})
