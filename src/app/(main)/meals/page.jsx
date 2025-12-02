import { useState, lazy, Suspense } from 'react'
import useFetch from '@/hooks/use-fetch'

import { getUser } from '@/lib/auth'
import { Edit, Check } from 'lucide-react'

import AppWrapper from '@/components/app-wrapper'

import { Button } from '@/components/ui/button'

const MealPlanCard = lazy(() => import('@/components/meal-plan-card'))

const MealsPage = () => {
  const user = getUser()
  const [editMode, setEditMode] = useState(false)

  const { data: menu } = useFetch('/meals', { suspense: true })

  return (
    <AppWrapper
      title='Thực đơn'
      className={'flex flex-col items-center gap-4'}
    >
      <menu className='flex w-full flex-row items-center'>
        <li>
          <Button
            onClick={() => {
              setEditMode((prev) => !prev)
            }}
            disabled={!(user?.role === 'executiveBoard' || user?.role === 'roomLeader' || user?.role === 'shopper')}
          >
            {editMode ? (
              <>
                <Check /> Hoàn thành
              </>
            ) : (
              <>
                <Edit /> Sửa
              </>
            )}
          </Button>
        </li>
      </menu>
      <div className='flex flex-row flex-wrap gap-4'>
        <Suspense fallback={<span>Đang tải...</span>}>
          {[0, 1, 2, 3, 4, 5, 6].map((day) => (
            <MealPlanCard
              key={`mealPlanCard${day}`}
              day={day}
              editMode={editMode}
              lunch={menu.find((m) => m.day == day && m.meal == 'lunch')}
              dinner={menu.find((m) => m.day == day && m.meal == 'dinner')}
            />
          ))}
        </Suspense>
      </div>
    </AppWrapper>
  )
}

export default MealsPage
