import { format, isToday, isBefore, isPast, startOfDay, startOfWeek, addDays, isSameDay, parse } from 'date-fns'
import { vi } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { getAccessToken } from '@/lib/auth'
import { mutate } from 'swr'
import { toast } from 'sonner'

import { Check, X, TimerReset } from 'lucide-react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const concatDateTime = (date, timeString) => {
  return parse(`${format(date, 'yyyy-MM-dd')} ${timeString}`, 'yyyy-MM-dd HH:mm', new Date())
}

const canRegisterMeal = (date) => {
  const registerUntil = concatDateTime(date, import.meta.env.VITE_MEAL_REGISTER_UNTIL)

  return isBefore(new Date(), registerUntil)
}

const canModifyMeal = (date, meal) => {
  let modifyUntil
  if (meal == 'lunch') {
    modifyUntil = concatDateTime(date, import.meta.env.VITE_LUNCH_MODIFY_UNTIL)
  } else if (meal == 'dinner') {
    modifyUntil = concatDateTime(date, import.meta.env.VITE_DINNER_MODIFY_UNTIL)
  } else {
    throw new Error('Invalid meal type')
  }

  return isBefore(new Date(), modifyUntil)
}

const MealRegistrationTable = ({ mealRegistrations }) => {
  let today = new Date()
  if (today.getDay() == 6 && today.getHours() >= 19) {
    today = addDays(today, 1)
  }
  const baseDay = startOfDay(startOfWeek(today))

  const modifyMeal = async (registration) => {
    const accessToken = await getAccessToken()

    const res = await fetch(import.meta.env.VITE_API_BASE + `/me/meal-registrations/${registration._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ late: !registration.late }),
    })

    if (!res.ok) {
      toast.error('Sửa đăng ký cơm thất bại.', { description: `Mã lỗi: ${res.status}` })
      console.log(await res.json())

      return
    }

    toast.success(`Sửa đăng ký cơm thành công.`)
    mutate('/me/meal-registrations')
  }

  const registerMeal = async ({ date, meal, late }) => {
    const accessToken = await getAccessToken()

    const res = await fetch(import.meta.env.VITE_API_BASE + `/me/meal-registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ date, meal, late }),
    })

    if (!res.ok) {
      toast.error('Đăng ký cơm thất bại.', { description: `Mã lỗi: ${res.status}` })
      console.log(await res.json())

      return
    }

    toast.success(`Đăng ký cơm thành công.`)
    mutate('/me/meal-registrations')
  }

  const cancelMeal = async (registration) => {
    const accessToken = await getAccessToken()

    const res = await fetch(import.meta.env.VITE_API_BASE + `/me/meal-registrations/${registration._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!res.ok) {
      toast.error('Hủy đăng ký cơm thất bại.', { description: `Mã lỗi: ${res.status}` })
      console.log(await res.json())

      return
    }

    toast.success(`Hủy đăng ký cơm thành công.`)
    mutate('/me/meal-registrations')
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ngày</TableHead>
          <TableHead className='text-center'>Trưa</TableHead>
          <TableHead className='text-center'>Tối</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 7 })
          .map((_, index) => addDays(baseDay, index))
          .map((date) => {
            const lunchRegistration = mealRegistrations.find((reg) => isSameDay(date, reg.date) && reg.meal == 'lunch')
            const dinnerRegistration = mealRegistrations.find((reg) => isSameDay(date, reg.date) && reg.meal == 'dinner')

            return (
              <TableRow
                key={`mealRegistration${format(date, 'yyyy-MM-dd')}`}
                className={cn(isToday(date) ? 'bg-muted/40' : isPast(date) && 'text-muted-foreground')}
              >
                <TableCell>{format(date, 'EEEE, dd/MM', { locale: vi })}</TableCell>

                <TableCell className='text-center'>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        disabled={!(canRegisterMeal(date) || (canModifyMeal(date, 'lunch') && !!lunchRegistration))}
                      >
                        {!!lunchRegistration ? !lunchRegistration.late ? <Check /> : <TimerReset /> : <X />}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-fit p-1'>
                      <div className='flex flex-row'>
                        <Button
                          variant='ghost'
                          size='icon'
                          disabled={
                            (!!lunchRegistration && !lunchRegistration.late) ||
                            !(canRegisterMeal(date) || (canModifyMeal(date, 'lunch') && !!lunchRegistration))
                          }
                          onClick={() => {
                            if (!lunchRegistration) {
                              registerMeal({ date, meal: 'lunch', late: false })
                            } else {
                              modifyMeal(lunchRegistration)
                            }
                          }}
                        >
                          <Check />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          disabled={
                            (!!lunchRegistration && lunchRegistration.late) ||
                            !(canRegisterMeal(date) || (canModifyMeal(date, 'lunch') && !!lunchRegistration))
                          }
                          onClick={() => {
                            if (!lunchRegistration) {
                              registerMeal({ date, meal: 'lunch', late: true })
                            } else {
                              modifyMeal(lunchRegistration)
                            }
                          }}
                        >
                          <TimerReset />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          disabled={!(canModifyMeal(date, 'lunch') && !!lunchRegistration)}
                          onClick={() => {
                            cancelMeal(lunchRegistration)
                          }}
                        >
                          <X />
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>

                <TableCell className='text-center'>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        disabled={!(canRegisterMeal(date) || (canModifyMeal(date, 'dinner') && !!dinnerRegistration))}
                      >
                        {!!dinnerRegistration ? !dinnerRegistration.late ? <Check /> : <TimerReset /> : <X />}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-fit p-1'>
                      <div className='flex flex-row'>
                        <Button
                          variant='ghost'
                          size='icon'
                          disabled={
                            (!!dinnerRegistration && !dinnerRegistration.late) ||
                            !(canRegisterMeal(date) || (canModifyMeal(date, 'dinner') && !dinnerRegistration))
                          }
                          onClick={() => {
                            if (!dinnerRegistration) {
                              registerMeal({ date, meal: 'dinner', late: false })
                            } else {
                              modifyMeal(dinnerRegistration)
                            }
                          }}
                        >
                          <Check />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          disabled={
                            (!!dinnerRegistration && dinnerRegistration.late) ||
                            !(canRegisterMeal(date) || (canModifyMeal(date, 'dinner') && !dinnerRegistration))
                          }
                          onClick={() => {
                            if (!dinnerRegistration) {
                              registerMeal({ date, meal: 'dinner', late: true })
                            } else {
                              modifyMeal(dinnerRegistration)
                            }
                          }}
                        >
                          <TimerReset />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          disabled={!(canModifyMeal(date, 'dinner') && !!dinnerRegistration)}
                          onClick={() => {
                            cancelMeal(dinnerRegistration)
                          }}
                        >
                          <X />
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            )
          })}
      </TableBody>
    </Table>
  )
}

export default MealRegistrationTable

export const MealRegistrationTableSkeleton = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ngày</TableHead>
          <TableHead className='text-center'>Trưa</TableHead>
          <TableHead className='text-center'>Tối</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(7)].map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className='h-4 w-20' />
            </TableCell>
            <TableCell>
              <Skeleton className='mx-auto my-1.5 h-6 w-6 rounded-lg' />
            </TableCell>
            <TableCell>
              <Skeleton className='mx-auto my-1.5 h-6 w-6 rounded-lg' />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
