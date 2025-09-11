import { useState } from 'react'
import useTheme from '@/hooks/use-theme'
import { getAccessToken } from '@/lib/auth'
import { toast } from 'sonner'

import { Sun, Moon, SunMoon } from 'lucide-react'

import AppWrapper from '@/components/app-wrapper'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

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

const SettingsPage = () => {
  const { theme, setTheme } = useTheme()

  const [notiStatus, setNotiStatus] = useState(() => {
    if ('Notification' in window) {
      return Notification.permission
    } else {
      return 'unsupported'
    }
  })

  const subscribeToPush = async (sub) => {
    const { endpoint, keys } = sub.toJSON()
    const accessToken = await getAccessToken()
    return fetch(import.meta.env.VITE_API_BASE + `/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ endpoint, keys, topic: 'general' }),
    })
  }

  return (
    <AppWrapper
      title='Cài đặt'
      className={'flex flex-col gap-2'}
    >
      <div className='text-card-foreground flex flex-row items-center justify-between gap-2'>
        <Label
          htmlFor='themeSelect'
          className='font-semibold'
        >
          Giao diện
        </Label>
        <Select
          onValueChange={(value) => setTheme(value)}
          value={theme}
          className='w-fit'
        >
          <SelectTrigger
            id='themeSelect'
            className='w-fit'
          >
            <SelectValue placeholder='Chọn chủ đề' />
          </SelectTrigger>
          <SelectContent position='popper'>
            <SelectItem value='light'>
              <span className='flex flex-row items-center gap-1'>
                <Sun
                  width={16}
                  height={16}
                />
                Sáng
              </span>
            </SelectItem>
            <SelectItem value='dark'>
              <span className='flex flex-row items-center gap-1'>
                <Moon
                  width={16}
                  height={16}
                />
                Tối
              </span>
            </SelectItem>
            <SelectItem value='system'>
              <span className='flex flex-row items-center gap-1'>
                <SunMoon
                  width={16}
                  height={16}
                />
                Tự động
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='text-card-foreground flex flex-row items-center justify-between gap-2'>
        <Label
          htmlFor='notificationSwitch'
          className='font-semibold'
        >
          Thông báo
        </Label>
        <Button
          id='notificationSwitch'
          disabled={['unsupported', 'granted', 'denied'].includes(notiStatus)}
          onClick={async () => {
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
              toast.error('Trình duyệt không hỗ trợ thông báo đẩy')
              return
            }

            const permission = await Notification.requestPermission()
            setNotiStatus(permission)

            if (permission === 'granted') {
              const registration = await navigator.serviceWorker.ready
              const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_WEBPUSH_VAPID_PUBLIC_KEY),
              })

              const res = await subscribeToPush(sub)

              if (!res.ok) {
                toast.error('Đăng ký nhận thông báo thất bại', { description: `Mã lỗi: ${res.status}` })
                return
              }

              toast.success('Đăng ký nhận thông báo thành công')
            }
          }}
        >
          {notiStatus === 'default' && 'Bật'}
          {notiStatus === 'granted' && 'Đã bật'}
          {notiStatus === 'denied' && 'Bị chặn'}
          {notiStatus === 'unsupported' && 'Không hỗ trợ'}
        </Button>
      </div>
    </AppWrapper>
  )
}

export default SettingsPage
