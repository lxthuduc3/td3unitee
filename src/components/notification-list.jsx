import { format } from 'date-fns'

import { Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

const NotificationsList = ({ notifications = [] }) => {
  return (
    <div className='flex flex-col gap-3'>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <Link
            key={notification._id}
            to={`/notifications/${notification._id}`}
            className={`flex flex-col gap-3 rounded-2xl border p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
              !notification.seen
                ? 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50 shadow-md hover:shadow-yellow-200/50 dark:border-yellow-600 dark:from-gray-800 dark:to-gray-700 dark:hover:shadow-yellow-600/20'
                : 'dark:hover:bg-gray-750 border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
            }`}
          >
            <div className='flex flex-row items-start gap-3'>
              <div className='flex-shrink-0'>
                {!notification.seen ? (
                  <div className='h-3 w-3 animate-pulse rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 shadow-sm'></div>
                ) : (
                  <div className='h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-600'></div>
                )}
              </div>
              <div className='min-w-0 flex-1'>
                <div className='mb-1 flex items-center gap-2'>
                  {!notification.seen && (
                    <Badge className='bg-gradient-to-r from-yellow-400 to-amber-500 px-2 py-0.5 text-xs font-medium text-white'>
                      Mới
                    </Badge>
                  )}
                  <h4
                    className={`leading-tight font-semibold ${
                      !notification.seen ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {notification.title}
                  </h4>
                </div>
                <div className='flex items-center gap-2 text-xs'>
                  <span className='font-medium text-gray-600 dark:text-gray-400'>
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
              <div className='flex-shrink-0'>
                <svg
                  className='h-5 w-5 text-gray-400 dark:text-gray-500'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className='py-12 text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800'>
            <svg
              className='h-8 w-8 text-gray-400'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 20C10.9 20 10 19.1 10 18C10 16.9 10.9 16 12 16C13.1 16 14 16.9 14 18C14 19.1 13.1 20 12 20ZM12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8ZM12 14C13.1 14 14 14.9 14 16C14 17.1 13.1 18 12 18C10.9 18 10 17.1 10 16C10 14.9 10.9 14 12 14Z' />
            </svg>
          </div>
          <p className='text-lg font-medium text-gray-500 dark:text-gray-400'>Chưa có thông báo</p>
          <p className='mt-1 text-sm text-gray-400 dark:text-gray-500'>Các thông báo mới sẽ xuất hiện tại đây</p>
        </div>
      )}
    </div>
  )
}

export default NotificationsList

export const NotificationsListSkeleton = () => {
  return (
    <div className='flex flex-col gap-3'>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={`notificationItem${index}`}
          className='flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800'
        >
          <div className='flex items-start gap-3'>
            <Skeleton className='h-3 w-3 rounded-full bg-gray-200 dark:bg-gray-700' />
            <div className='flex-1 space-y-2'>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-5 w-12 rounded-full bg-yellow-200 dark:bg-yellow-800' />
                <Skeleton className='h-5 w-32 bg-gray-200 dark:bg-gray-700' />
              </div>
              <Skeleton className='h-3 w-48 bg-gray-200 dark:bg-gray-700' />
            </div>
            <Skeleton className='h-5 w-5 bg-gray-200 dark:bg-gray-700' />
          </div>
        </div>
      ))}
    </div>
  )
}
