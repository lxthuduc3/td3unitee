import { lazy, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import useFetch from '@/hooks/use-fetch'

import AppWrapper from '@/components/app-wrapper'
import { ProfileCardSkeleton } from '@/components/profile-card'
const ProfileCard = lazy(() => import('@/components/profile-card'))

const ProfilePage = () => {
  const { id } = useParams()
  const { data: profile } = useFetch(`/members/${id}`, { suspense: true })

  return (
    <AppWrapper
      title='Hồ sơ'
      className={''}
    >
      <Suspense fallback={<ProfileCardSkeleton />}>
        <ProfileCard
          profile={profile}
          isAbleToEdit={false}
        />
      </Suspense>
    </AppWrapper>
  )
}

export default ProfilePage
