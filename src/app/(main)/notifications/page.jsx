import { lazy, Suspense } from 'react'
import useFetch from '@/hooks/use-fetch'

import AppWrapper from '@/components/app-wrapper'
import { NotificationsListSkeleton } from '@/components/notification-list'
const NotificationsList = lazy(() => import('@/components/notification-list'))

const NotificationsPage = () => {
  const { data: notifications } = useFetch(`/notifications`, { suspense: true, refreshInterval: 30000 })

  return (
    <AppWrapper
      title='Thông báo'
      className={'flex flex-col gap-4'}
    >
      <Suspense fallback={<NotificationsListSkeleton />}>
        <NotificationsList notifications={notifications} />
      </Suspense>
    </AppWrapper>
  )
}

export default NotificationsPage
