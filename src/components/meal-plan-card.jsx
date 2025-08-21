import useFetch from '@/hooks/use-fetch'
import { buildUrl } from '@/lib/utils'
import { mutate } from 'swr'
import { toast } from 'sonner'
import { getAccessToken } from '@/lib/auth'

import { daysOfWeek } from '@/lib/display-text'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Utensils } from 'lucide-react'
import { Suspense } from 'react'

const DishSelect = ({ type, value, onValueChange }) => {
  const { data: dishes } = useFetch(buildUrl('/dishes', { type }), { suspense: true })

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
    >
      <SelectTrigger>
        <SelectValue placeholder='Chọn món' />
      </SelectTrigger>
      <SelectContent>
        <Suspense fallback={<span className='text-muted-foreground text-sm italic'>Đang tải...</span>}>
          {dishes.map((dish) => (
            <SelectItem
              key={dish._id}
              value={dish._id}
            >
              {dish.name}
            </SelectItem>
          ))}
        </Suspense>
      </SelectContent>
    </Select>
  )
}

const MealPlanCard = ({ editMode, lunch, dinner, day }) => {
  const handleUpdate = async (mealId, dish) => {
    const accessToken = await getAccessToken()

    const res = await fetch(import.meta.env.VITE_API_BASE + `/meals/${mealId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(dish),
    })

    if (!res.ok) {
      toast.error(`Chỉnh sửa thực đơn thất bại.`, { description: `Mã lỗi: ${res.status}` })
      console.log(await res.json())

      return
    }

    toast.success(`Chỉnh sửa thực đơn thành công.`)
    mutate((key) => key.includes('/meals'))
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>{daysOfWeek[day]}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <h4 className='flex flex-row gap-1 font-semibold'>
              <Utensils /> Bữa trưa
            </h4>
            {editMode ? (
              <>
                <DishSelect
                  type='main'
                  value={lunch.mainDish?._id}
                  onValueChange={(value) => handleUpdate(lunch._id, { mainDish: value })}
                />

                <DishSelect
                  type='vegie'
                  value={lunch.vegie?._id}
                  onValueChange={(value) => handleUpdate(lunch._id, { vegie: value })}
                />

                <DishSelect
                  type='soup'
                  value={lunch.soup?._id}
                  onValueChange={(value) => handleUpdate(lunch._id, { soup: value })}
                />
              </>
            ) : (
              <>
                <span className={lunch.mainDish ? '' : 'text-muted-foreground'}>{lunch.mainDish?.name || '<Chưa đặt>'}</span>
                <span className={lunch.vegie ? '' : 'text-muted-foreground'}>{lunch.vegie?.name || '<Chưa đặt>'}</span>
                <span className={lunch.soup ? '' : 'text-muted-foreground'}>{lunch.soup?.name || '<Chưa đặt>'}</span>
              </>
            )}
          </div>

          <div className='flex flex-col gap-2'>
            <h4 className='flex flex-row gap-1 font-semibold'>
              <Utensils /> Bữa tối
            </h4>
            {editMode ? (
              <>
                <DishSelect
                  type='main'
                  value={dinner.mainDish?._id}
                  onValueChange={(value) => handleUpdate(dinner._id, { mainDish: value })}
                />

                <DishSelect
                  type='vegie'
                  value={dinner.vegie?._id}
                  onValueChange={(value) => handleUpdate(dinner._id, { vegie: value })}
                />

                <DishSelect
                  type='soup'
                  value={dinner.soup?._id}
                  onValueChange={(value) => handleUpdate(dinner._id, { soup: value })}
                />
              </>
            ) : (
              <>
                <span className={dinner.mainDish ? '' : 'text-muted-foreground'}>{dinner.mainDish?.name || '<Chưa đặt>'}</span>
                <span className={dinner.vegie ? '' : 'text-muted-foreground'}>{dinner.vegie?.name || '<Chưa đặt>'}</span>
                <span className={dinner.soup ? '' : 'text-muted-foreground'}>{dinner.soup?.name || '<Chưa đặt>'}</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MealPlanCard
