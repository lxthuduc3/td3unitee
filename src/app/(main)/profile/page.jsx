'use client'

import { Suspense, lazy } from 'react'
import useFetch from '@/hooks/use-fetch'

import AppWrapper from '@/components/app-wrapper'
import { ProfileCardSkeleton } from '@/components/profile-card'
const ProfileCard = lazy(() => import('@/components/profile-card'))

const ProfilePage = () => {
  const { data: profile } = useFetch('/me/profile', { suspense: true })

  return (
    <AppWrapper
      title='Hồ sơ'
      className={''}
    >
      <Suspense fallback={<ProfileCardSkeleton />}>
        <ProfileCard
          profile={profile}
          isAbleToEdit={true}
        />
      </Suspense>
    </AppWrapper>
  )
}

export default ProfilePage
