import useFetch from '@/hooks/use-fetch'

import { Suspense, lazy } from 'react'
import AppWrapper from '@/components/app-wrapper'
import { MealRegistrationTableSkeleton } from '@/components/meal-registration-table'
const MealRegistrationTable = lazy(() => import('@/components/meal-registration-table'))

const MealRegistrationPage = () => {
  const { data: mealRegistrations } = useFetch('/me/meal-registrations', { suspense: true })

  return (
    <AppWrapper
      title='Đăng ký cơm'
      className={'flex flex-col gap-4'}
    >
      <p className='text-center text-xs italic'>Nhấn vào biểu tượng trong mỗi ô để chỉnh sửa</p>
      <p className='text-center text-xs italic'>
        Đăng ký cơm cho một ngày phải được thực hiện trước {import.meta.env.VITE_MEAL_REGISTER_UNTIL}
      </p>
      <p className='text-center text-xs italic'>
        Điều chỉnh phải được thực hiện trước {import.meta.env.VITE_LUNCH_MODIFY_UNTIL} và{' '}
        {import.meta.env.VITE_DINER_MODIFY_UNTIL}
        <br />
        (Có thể hủy đăng ký)
      </p>
      <Suspense fallback={<MealRegistrationTableSkeleton />}>
        <MealRegistrationTable mealRegistrations={mealRegistrations} />
      </Suspense>
    </AppWrapper>
  )
}

export default MealRegistrationPage
