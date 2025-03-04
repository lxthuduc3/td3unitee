import useTheme from '@/hooks/use-theme'

import { Sun, Moon, SunMoon } from 'lucide-react'

import AppWrapper from '@/components/app-wrapper'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const SettingsPage = () => {
  const { theme, setTheme } = useTheme()
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
          disabled={!!Notification || Notification.permission == 'granted'}
          onClick={async () => {
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
                console.log(token)
              } else {
                console.log('No registration token available.')
              }
            }
          }}
        >
          Bật
        </Button>
      </div>
    </AppWrapper>
  )
}

export default SettingsPage
