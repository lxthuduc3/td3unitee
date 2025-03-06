import { useParams } from 'react-router-dom'
import useFetch from '@/hooks/use-fetch'
import useAuth from '@/hooks/use-auth'
import { mutate } from 'swr'
import { format } from 'date-fns'
import { toast } from 'sonner'

import { MailOpen } from 'lucide-react'

import AppWrapper from '@/components/app-wrapper'
import { Suspense } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const NotificationPage = () => {
  const { id } = useParams()
  const { accessToken } = useAuth()

  const { data: notification } = useFetch(`/notifications/${id}`, { suspense: true })

  const handleMarkAsRead = async () => {
    const res = await fetch(import.meta.env.VITE_API_BASE + `/notifications/${id}/mark-as-read`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!res.ok) {
      toast.error('Đánh dấu là đã đọc thất bại.', { description: `Mã lỗi: ${res.status}` })
      console.log(await res.json())

      return
    }

    toast.success(`Đánh dấu là đã đọc thành công.`)
    mutate((key) => key.includes('/notification'))
  }

  return (
    <AppWrapper
      title='Chi tiết thông báo'
      className={'flex flex-col gap-4'}
    >
      <Suspense>
        <div className='flex flex-row gap-2'>
          {<Badge variant='outline'>{notification.seen ? 'Đã đọc' : 'Chưa đọc'}</Badge>}
          <h4 className='font-bold'>{notification.title}</h4>
        </div>
        <span className='text-muted-foreground text-xs'>
          {notification.sender.familyName} {notification.sender.givenName} lúc{' '}
          <time dateTime={notification.createdAt}>{format(notification.createdAt, 'HH:mm, dd/MM/yyyy')}</time>
        </span>

        {notification.body.split('\n').map((para, index) => (
          <p key={`notificationParagraph${index}`}>{para}</p>
        ))}

        {!notification.seen && (
          <Button
            variant='outline'
            className='w-fit self-center'
            type='button'
            onClick={handleMarkAsRead}
          >
            <MailOpen /> Đánh dấu là đã đọc
          </Button>
        )}
      </Suspense>
    </AppWrapper>
  )
}

export default NotificationPage
