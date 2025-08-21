import { lazy, Suspense } from 'react'
import useFetch from '@/hooks/use-fetch'

import AppWrapper from '@/components/app-wrapper'
import { ProfileFormSkeleton } from '@/components/profile-form'
const ProfileForm = lazy(() => import('@/components/profile-form'))

const ProfileEditPage = () => {
  const { data: profile } = useFetch('/me/profile', { suspense: true })

  return (
    <AppWrapper title='Chỉnh sửa hồ sơ'>
      <Suspense fallback={<ProfileFormSkeleton />}>
        <ProfileForm currentProfile={profile} />
      </Suspense>
    </AppWrapper>
  )
}

export default ProfileEditPage
