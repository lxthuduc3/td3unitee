import { toast } from 'sonner'
import useAuth from '@/hooks/use-auth'

import pop from '@/assets/sounds/pop.mp3'

import { useEffect } from 'react'

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const NotificationProvider = ({ children }) => {
  const { accessToken } = useAuth()

  useEffect(() => {
    const requestPermission = async () => {
      const curentPermission = Notification.permission
      const permission = await Notification.requestPermission()
      if (permission == 'granted') {
        const registration = await navigator.serviceWorker.ready

        const sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_WEBPUSH_VAPID_PUBLIC_KEY),
        })

        const { endpoint, keys } = JSON.parse(JSON.stringify(sub))

        const res = await fetch(import.meta.env.VITE_API_BASE + `/notifications/subscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ endpoint, keys, topic: 'general' }),
        })

        if (!res.ok) {
          toast.error('Đăng ký nhận thông báo thất bại', { description: `Mã lỗi: ${res.status}` })
          console.log(await res.json())
          return
        }

        if (curentPermission != 'granted') {
          toast.success('Đăng ký nhận thông báo thành công')
        }
      }
    }

    if ('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window) {
      requestPermission()

      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log(event.data)

        toast.info(event.data.title, { description: event.data.body })
        new Audio(pop).play()
      })
    }
  }, [])

  return children
}

export default NotificationProvider
