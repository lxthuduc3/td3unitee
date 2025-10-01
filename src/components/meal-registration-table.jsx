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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
    <div className='overflow-hidden rounded-xl border border-yellow-100 dark:border-yellow-900'>
      <Table>
        <TableHeader>
          <TableRow className='bg-gradient-to-r from-yellow-100 to-amber-100 hover:bg-gradient-to-r hover:from-yellow-100 hover:to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40 dark:hover:from-yellow-900/40 dark:hover:to-amber-900/40'>
            <TableHead className='font-bold text-yellow-800 dark:text-yellow-200'>Ngày</TableHead>
            <TableHead className='text-center font-bold text-yellow-800 dark:text-yellow-200'>🍽️ Trưa</TableHead>
            <TableHead className='text-center font-bold text-yellow-800 dark:text-yellow-200'>🌙 Tối</TableHead>
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
                  className={cn(
                    'transition-colors hover:bg-yellow-50 dark:hover:bg-yellow-950/20',
                    isToday(date)
                      ? 'border-l-4 border-l-yellow-500 bg-yellow-100 dark:bg-yellow-900/30'
                      : isPast(date) && 'text-muted-foreground bg-muted/20'
                  )}
                >
                  <TableCell className='font-medium'>
                    <div className='flex flex-col'>
                      <span className={cn('font-semibold', isToday(date) && 'text-yellow-700 dark:text-yellow-300')}>
                        {format(date, 'EEEE', { locale: vi })}
                      </span>
                      <span className='text-muted-foreground text-sm'>{format(date, 'dd/MM')}</span>
                      {isToday(date) && (
                        <span className='mt-1 w-fit rounded-full bg-yellow-200 px-2 py-0.5 text-xs text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'>
                          Hôm nay
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className='text-center'>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          disabled={!(canRegisterMeal(date) || (canModifyMeal(date, 'lunch') && !!lunchRegistration))}
                          className={cn(
                            'h-10 w-10 rounded-xl transition-all duration-200',
                            !lunchRegistration
                              ? 'text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30'
                              : lunchRegistration.late
                                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-400 dark:hover:bg-yellow-800/50'
                                : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-400 dark:hover:bg-green-800/50'
                          )}
                        >
                          {!lunchRegistration ? (
                            <X className='h-5 w-5' />
                          ) : lunchRegistration.late ? (
                            <TimerReset className='h-5 w-5' />
                          ) : (
                            <Check className='h-5 w-5' />
                          )}
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

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant='ghost'
                                size='icon'
                                disabled={!(canModifyMeal(date, 'lunch') && !!lunchRegistration)}
                              >
                                <X />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Xác nhận</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Nếu hiện tại là sau {import.meta.env.VITE_MEAL_REGISTER_UNTIL}, bạn sẽ KHÔNG đăng ký cơm lại
                                  được nữa. Bạn chắc chắn muốn thực hiện HỦY CƠM chứ?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    cancelMeal(lunchRegistration)
                                  }}
                                >
                                  Tiếp tục
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
                          className={cn(
                            'h-10 w-10 rounded-xl transition-all duration-200',
                            !dinnerRegistration
                              ? 'text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30'
                              : dinnerRegistration.late
                                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-400 dark:hover:bg-yellow-800/50'
                                : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-400 dark:hover:bg-green-800/50'
                          )}
                        >
                          {!dinnerRegistration ? (
                            <X className='h-5 w-5' />
                          ) : dinnerRegistration.late ? (
                            <TimerReset className='h-5 w-5' />
                          ) : (
                            <Check className='h-5 w-5' />
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-fit p-1'>
                        <div className='flex flex-row'>
                          <Button
                            variant='ghost'
                            size='icon'
                            disabled={
                              (!!dinnerRegistration && !dinnerRegistration.late) ||
                              !(canRegisterMeal(date) || (canModifyMeal(date, 'dinner') && !!dinnerRegistration))
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
                              !(canRegisterMeal(date) || (canModifyMeal(date, 'dinner') && !!dinnerRegistration))
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

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant='ghost'
                                size='icon'
                                disabled={!(canModifyMeal(date, 'dinner') && !!dinnerRegistration)}
                              >
                                <X />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Xác nhận</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Nếu hiện tại là sau {import.meta.env.VITE_MEAL_REGISTER_UNTIL}, bạn sẽ KHÔNG đăng ký cơm lại
                                  được nữa. Bạn chắc chắn muốn thực hiện HỦY CƠM chứ?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    cancelMeal(dinnerRegistration)
                                  }}
                                >
                                  Tiếp tục
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
    </div>
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
