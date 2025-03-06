import { toast } from 'sonner'
import useAuth from '@/hooks/use-auth'

import { useEffect } from 'react'
import { messaging } from '@/lib/firebase'
import { getToken, onMessage } from 'firebase/messaging'

const NotificationProvider = ({ children }) => {
  const { accessToken } = useAuth()

  useEffect(() => {
    const requestPermission = async () => {
      const permission = await Notification.requestPermission()
      if (permission == 'granted') {
        const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_PUBLIC_KEY })

        if (token) {
          const res = await fetch(import.meta.env.VITE_API_BASE + `/notifications/subscribe`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ token }),
          })

          if (!res.ok) {
            toast.error('Đăng ký nhận thông báo thất bại', { description: `Mã lỗi: ${res.status}` })
            console.log(await res.json())
            return
          }

          toast.success('Đăng ký nhận thông báo thành công')
          console.log(token)
        } else {
          console.log('No registration token available.')
        }
      }
    }

    if ('Notification' in window) {
      requestPermission()
    }
  }, [])

  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log(payload)

      toast.info(payload.notification.title, { description: payload.notification.body })
    })
  }, [])

  return children
}

export default NotificationProvider
