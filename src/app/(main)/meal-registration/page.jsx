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
      className={
        'flex flex-col gap-6 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20'
      }
    >
      {/* Header Info Card */}
      <div className='rounded-2xl bg-gradient-to-r from-yellow-200 to-amber-300 p-6 text-black shadow-lg dark:from-yellow-600 dark:to-yellow-700'>
        <div className='mb-4 flex items-center gap-3'>
          <div className='rounded-lg bg-white/30 p-2 text-yellow-700 dark:bg-white/20 dark:text-yellow-200'>
            <svg
              className='h-6 w-6'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                d='M12 2C6.48 2 2 6.48 2 12s4.48 
                 10 10 10 10-4.48 10-10S17.52 2 
                 12 2zm-2 15l-5-5 1.41-1.41L10 
                 14.17l7.59-7.59L19 8l-9 9z'
              />
            </svg>
          </div>
          <h2 className='text-xl font-bold text-amber-900 dark:text-white'>Hướng dẫn đăng ký</h2>
        </div>

        {/* body text */}
        <div className='space-y-3 text-amber-900 dark:text-yellow-100'>
          <div className='flex items-start gap-3'>
            <div className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-500/30'>
              <span className='text-sm font-bold text-yellow-700 dark:text-yellow-200'>1</span>
            </div>
            <p className='text-sm'>Nhấn vào biểu tượng trong mỗi ô để chỉnh sửa đăng ký</p>
          </div>

          <div className='flex items-start gap-3'>
            <div className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-500/30'>
              <span className='text-sm font-bold text-yellow-700 dark:text-yellow-200'>2</span>
            </div>
            <p className='text-sm'>
              Đăng ký cơm phải thực hiện trước{' '}
              <span className='font-semibold text-amber-900 dark:text-white'>{import.meta.env.VITE_MEAL_REGISTER_UNTIL}</span>
            </p>
          </div>

          <div className='flex items-start gap-3'>
            <div className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-500/30'>
              <span className='text-sm font-bold text-yellow-700 dark:text-yellow-200'>3</span>
            </div>
            <div className='text-sm'>
              <p className='mb-1'>Điều chỉnh phải thực hiện trước:</p>
              <p className='ml-3'>
                • Trưa:{' '}
                <span className='font-semibold text-amber-900 dark:text-white'>{import.meta.env.VITE_LUNCH_MODIFY_UNTIL}</span>
              </p>
              <p className='ml-3'>
                • Tối:{' '}
                <span className='font-semibold text-amber-900 dark:text-white'>{import.meta.env.VITE_DINNER_MODIFY_UNTIL}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className='bg-card rounded-2xl border border-yellow-200 p-6 shadow-sm dark:border-yellow-800'>
        <div className='mb-6 flex items-center gap-3'>
          <div className='rounded-lg bg-yellow-400 p-2 dark:bg-yellow-500'>
            <svg
              className='h-6 w-6 text-white'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z' />
            </svg>
          </div>
          <h2 className='text-foreground text-xl font-bold'>Lịch đăng ký tuần này</h2>
        </div>

        <Suspense fallback={<MealRegistrationTableSkeleton />}>
          <MealRegistrationTable mealRegistrations={mealRegistrations} />
        </Suspense>
      </div>
    </AppWrapper>
  )
}

export default MealRegistrationPage
