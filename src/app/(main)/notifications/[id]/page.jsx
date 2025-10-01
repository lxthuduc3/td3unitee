import { useParams } from 'react-router-dom'
import useFetch from '@/hooks/use-fetch'
import { getAccessToken } from '@/lib/auth'
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

  const { data: notification } = useFetch(`/notifications/${id}`, { suspense: true })

  const handleMarkAsRead = async () => {
    const accessToken = await getAccessToken()

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
      className='min-h-screen bg-gray-50 dark:bg-black'
    >
      <Suspense>
        {/* Notification Card */}
        <div
          className={`rounded-2xl border bg-white p-6 shadow-lg dark:bg-gray-800 ${
            !notification.seen
              ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 dark:border-yellow-600 dark:from-gray-800 dark:to-gray-700'
              : 'border-gray-200 dark:border-gray-700'
          }`}
        >
          {/* Header */}
          <div className='mb-4 flex items-start gap-4 border-b border-gray-200 pb-4 dark:border-gray-700'>
            <div className='flex-shrink-0'>
              {!notification.seen ? (
                <div className='h-4 w-4 animate-pulse rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 shadow-sm'></div>
              ) : (
                <div className='h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600'></div>
              )}
            </div>

            <div className='min-w-0 flex-1'>
              <div className='mb-2 flex items-center gap-3'>
                <Badge
                  className={`text-xs font-medium ${
                    !notification.seen
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {notification.seen ? 'Đã đọc' : 'Chưa đọc'}
                </Badge>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white'>{notification.title}</h2>
              </div>

              <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                <span className='font-medium'>
                  {notification.sender.familyName} {notification.sender.givenName}
                </span>
                <span className='text-gray-400 dark:text-gray-500'>•</span>
                <time
                  dateTime={notification.createdAt}
                  className='text-gray-500 dark:text-gray-400'
                >
                  {format(notification.createdAt, 'HH:mm, dd/MM/yyyy')}
                </time>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className='mb-6 space-y-4'>
            {notification.body.split('\n').map((para, index) => (
              <p
                key={`notificationParagraph${index}`}
                className='text-base leading-relaxed text-gray-700 dark:text-gray-300'
              >
                {para}
              </p>
            ))}
          </div>

          {/* Action Button */}
          {!notification.seen && (
            <div className='flex justify-center border-t border-gray-200 pt-4 dark:border-gray-700'>
              <Button
                className='transform rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 px-6 py-2.5 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-yellow-600 hover:to-amber-600 hover:shadow-xl'
                type='button'
                onClick={handleMarkAsRead}
              >
                <MailOpen className='mr-2 h-5 w-5' />
                Đánh dấu là đã đọc
              </Button>
            </div>
          )}
        </div>
      </Suspense>
    </AppWrapper>
  )
}

export default NotificationPage
