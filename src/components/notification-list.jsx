import { format } from 'date-fns'

import { Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

const NotificationsList = ({ notifications = [] }) => {
  return (
    <div className='flex flex-col gap-2'>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <Link
            key={notification._id}
            to={`/notifications/${notification._id}`}
            className='flex flex-col gap-1 rounded-lg border p-2'
          >
            <div className='flex flex-row gap-2'>
              {!notification.seen && <Badge variant='outline'>Chưa đọc</Badge>}
              <h4 className='font-bold'>{notification.title}</h4>
            </div>
            <span className='text-muted-foreground text-xs'>
              {notification.sender.familyName} {notification.sender.givenName} lúc{' '}
              <time dateTime={notification.createdAt}>{format(notification.createdAt, 'HH:mm, dd/MM/yyyy')}</time>
            </span>
          </Link>
        ))
      ) : (
        <span className='text-muted-foreground w-full text-center text-sm italic'>Không có thông báo</span>
      )}
    </div>
  )
}

export default NotificationsList

export const NotificationsListSkeleton = () => {
  return (
    <div className='flex flex-col gap-2'>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={`notificationItem${index}`}
          className='flex flex-col gap-1 rounded-lg border p-3'
        >
          <Skeleton className='h-5 w-10 py-0.5'></Skeleton>
          <Skeleton className='h-3 w-32 py-0.5'></Skeleton>
        </div>
      ))}
    </div>
  )
}
