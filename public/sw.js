self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json()

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
