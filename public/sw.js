self.addEventListener('push', (event) => {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return
  }

  const data = event.data?.json() ?? {}
  const title = data.title || 'Something Has Happened'
  const message = data.message || "Here's something you might want to check out."

  const notification = new self.Notification(title, {
    body: message,
    icon: '/icon.png',
  })

  notification.addEventListener('click', () => {
    clients.openWindow('https://td3unitee.vercel.app')
  })
})
