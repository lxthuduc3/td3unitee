import { useState, Suspense } from 'react'
import useFetch from '@/hooks/use-fetch'
import { format } from 'date-fns'
import { getAbbreviationName } from '@/lib/utils'
import AppWrapper from '@/components/app-wrapper'
import DatePicker from '@/components/ext/date-picker'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import { ChefHat, Users, UtensilsCrossed } from 'lucide-react'

const CookingPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState(new Date())
  const [meal, setMeal] = useState(() => (new Date().getHours() >= 12 ? 'dinner' : 'lunch'))

  const { data: menu, mutate: refreshMenu } = useFetch(`/meals/${date.getDay()}/${meal}`, { suspense: true })
  const { data: eaters, mutate: refreshEaters } = useFetch(`/meal-registrations/${format(date, 'yyyy-MM-dd')}/${meal}`, {
    suspense: true,
  })

  const { data: cookingers } = useFetch(`/duty-schedules/cooking/${format(date, 'yyyy-MM-dd')}/${meal}`, {
    suspense: true,
  })

  const handleRefresh = async () => {
    try {
      setIsLoading(true)

      const start = Date.now()
      await Promise.all([refreshMenu(), refreshEaters()])
      const elapsed = Date.now() - start

      // đảm bảo skeleton hiển thị ít nhất 500ms
      const minDelay = 500
      if (elapsed < minDelay) {
        await new Promise((resolve) => setTimeout(resolve, minDelay - elapsed))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppWrapper
      title='Nấu cơm'
      className={
        'flex flex-col gap-6 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20'
      }
    >
      {/* Header Section */}
      <div className='rounded-2xl bg-gradient-to-r from-yellow-200 to-yellow-400 p-6 shadow-md dark:from-yellow-500 dark:to-yellow-700'>
        <div className='mb-4 flex items-center gap-3'>
          <div className='rounded-lg bg-white/30 p-2 text-yellow-800 dark:text-yellow-100'>
            <UtensilsCrossed />
          </div>
          <div>
            <p className='text-yellow-800 dark:text-yellow-100'>Quản lý thực đơn và danh sách ăn cơm</p>
          </div>
        </div>

        <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
          <div className='rounded-xl bg-white/30 p-4 backdrop-blur-sm dark:bg-yellow-800/30'>
            <DatePicker
              date={date}
              onDateChange={setDate}
              popoverPosition='center'
            />
          </div>

          <div className='rounded-xl bg-white/30 p-2 backdrop-blur-sm dark:bg-yellow-800/30'>
            <Tabs
              value={meal}
              onValueChange={setMeal}
            >
              <TabsList className='bg-white/40 text-gray-800 dark:bg-yellow-700/40 dark:text-yellow-100'>
                <TabsTrigger
                  value='lunch'
                  className='data-[state=active]:bg-white data-[state=active]:text-yellow-600 dark:data-[state=active]:bg-yellow-600 dark:data-[state=active]:text-yellow-100'
                >
                  🍽️ Bữa trưa
                </TabsTrigger>
                <TabsTrigger
                  value='dinner'
                  className='data-[state=active]:bg-white data-[state=active]:text-yellow-600 dark:data-[state=active]:bg-yellow-600 dark:data-[state=active]:text-yellow-100'
                >
                  🌙 Bữa tối
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {isLoading ? (
        <CookingSkeleton />
      ) : (
        <>
          {/* Menu Section */}
          <div className='bg-card w-full rounded-2xl border border-yellow-200 p-6 shadow-sm dark:border-yellow-800'>
            <div className='mb-6 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-yellow-400 p-2 dark:bg-yellow-500'>
                  <UtensilsCrossed />
                </div>
                <h2 className='text-foreground text-xl font-bold'>Thực đơn hôm nay</h2>
              </div>

              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className='rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400 p-3 text-white transition-all duration-200 hover:scale-105 hover:from-yellow-500 hover:to-amber-500 hover:shadow-lg disabled:scale-100 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500'
              >
                {isLoading ? (
                  <svg
                    className='h-5 w-5 animate-spin'
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className='h-5 w-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99'
                    />
                  </svg>
                )}
              </button>
            </div>
            <Suspense
              fallback={
                <span className='text-muted-foreground w-full animate-pulse text-center text-sm italic'>Đang tải...</span>
              }
            >
              <Accordion
                type='multiple'
                collapsible='true'
                className='w-full'
              >
                <AccordionItem value={menu.mainDish?._id}>
                  <AccordionTrigger>{menu.mainDish?.name}</AccordionTrigger>
                  <AccordionContent>{menu.mainDish?.ingredients.map((i) => i.name).join(', ')}</AccordionContent>
                </AccordionItem>

                <AccordionItem value={menu.vegie?._id}>
                  <AccordionTrigger>{menu.vegie?.name}</AccordionTrigger>
                  <AccordionContent>{menu.vegie?.ingredients.map((i) => i.name).join(', ')}</AccordionContent>
                </AccordionItem>

                <AccordionItem value={menu.soup?._id}>
                  <AccordionTrigger>{menu.soup?.name}</AccordionTrigger>
                  <AccordionContent>{menu.soup?.ingredients.map((i) => i.name).join(', ')}</AccordionContent>
                </AccordionItem>
              </Accordion>
            </Suspense>
          </div>

          {/* Eaters Section */}
          <div className='bg-card w-full rounded-2xl border border-yellow-200 p-6 shadow-sm dark:border-yellow-800'>
            <div className='mb-6 flex items-center gap-3'>
              <div className='rounded-lg bg-amber-400 p-2 dark:bg-amber-500'>
                <Users />
              </div>
              <h2 className='text-foreground text-xl font-bold'>Số người ăn</h2>
            </div>

            <Suspense
              fallback={<span className='text-muted-foreground w-full animate-pulse text-center text-sm'>Đang tải...</span>}
            >
              {/* Stats Cards */}
              <div className='mb-6 grid grid-cols-3 gap-4'>
                <div className='rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-3 dark:border-blue-800 dark:from-blue-950/40 dark:to-blue-900/40'>
                  <div className='text-2xl font-bold text-blue-700 dark:text-blue-300'>{eaters?.length || 0}</div>
                  <div className='text-sm text-blue-600 dark:text-blue-400'>Tổng</div>
                </div>

                <div className='rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-3 dark:border-green-800 dark:from-green-950/40 dark:to-green-900/40'>
                  <div className='text-2xl font-bold text-green-700 dark:text-green-300'>
                    {eaters?.filter((e) => !e.late).length || 0}
                  </div>
                  <div className='text-sm text-green-600 dark:text-green-400'>Đúng giờ</div>
                </div>

                <div className='rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-3 dark:border-orange-800 dark:from-orange-950/40 dark:to-orange-900/40'>
                  <div className='text-2xl font-bold text-orange-700 dark:text-orange-300'>
                    {eaters?.filter((e) => e.late).length || 0}
                  </div>
                  <div className='text-sm text-orange-600 dark:text-orange-400'>Cơm trễ</div>
                </div>
              </div>

              {/* On-time Eaters */}
              <div className='mb-6'>
                <h4 className='mb-4 flex items-center gap-2 font-semibold text-green-700 dark:text-green-300'>
                  <div className='h-3 w-3 rounded-full bg-green-500'></div>
                  Danh sách ăn đúng giờ ({eaters?.filter((e) => !e.late).length || 0} người)
                </h4>
                <div className='grid grid-cols-6 gap-3'>
                  {eaters
                    ?.filter((e) => !e.late)
                    .map((eater) => (
                      <TooltipProvider key={eater.user._id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className='flex flex-col items-center rounded-xl bg-green-50 p-2 transition-colors hover:bg-green-100 dark:border-green-800 dark:bg-green-950/30 dark:hover:bg-green-900/40'>
                              <Avatar className='ring-2 ring-green-200 dark:ring-green-800'>
                                <AvatarImage src={eater.user.avatar} />
                                <AvatarFallback className='bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'>
                                  {getAbbreviationName(eater.user.givenName || 'User')}
                                </AvatarFallback>
                              </Avatar>
                              <span className='mt-1 text-center text-xs font-medium text-green-700 dark:text-green-300'>
                                {eater.user.givenName}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {eater.user.familyName} {eater.user.givenName}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                </div>
              </div>

              {/* Late Eaters */}
              <div className='mb-6'>
                <h4 className='mb-4 flex items-center gap-2 font-semibold text-orange-700 dark:text-orange-300'>
                  <div className='h-3 w-3 rounded-full bg-orange-500'></div>
                  Danh sách cơm trễ({eaters?.filter((e) => e.late).length || 0} người)
                </h4>
                <div className='grid grid-cols-6 gap-3'>
                  {eaters
                    ?.filter((e) => e.late)
                    .map((eater) => (
                      <TooltipProvider key={eater.user._id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className='flex flex-col items-center rounded-xl bg-orange-50 p-2 transition-colors hover:bg-orange-100 dark:bg-orange-950/30 dark:hover:bg-orange-900/40'>
                              <Avatar className='ring-2 ring-orange-200 dark:ring-orange-800'>
                                <AvatarImage src={eater.user.avatar} />
                                <AvatarFallback className='bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'>
                                  {getAbbreviationName(eater.user.givenName || 'User')}
                                </AvatarFallback>
                              </Avatar>
                              <span className='mt-1 text-center text-xs font-medium text-orange-700 dark:text-orange-300'>
                                {eater.user.givenName}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {eater.user.familyName} {eater.user.givenName}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                </div>
              </div>
            </Suspense>
          </div>

          {/* Cookers Section */}
          <div className='bg-card w-full rounded-2xl border border-yellow-200 p-6 shadow-sm dark:border-yellow-800'>
            <div className='mb-6 flex items-center gap-3'>
              <div className='rounded-lg bg-red-400 p-2 dark:bg-red-500'>
                <ChefHat />
              </div>
              <h2 className='text-foreground text-xl font-bold'>Anh em nấu cơm</h2>
            </div>

            <Suspense
              fallback={<span className='text-muted-foreground w-full animate-pulse text-center text-sm'>Đang tải...</span>}
            >
              <div className='grid grid-cols-6 gap-3'>
                {cookingers?.schedule?.users?.length > 0 ? (
                  cookingers.schedule.users.map((cookinger) => (
                    <TooltipProvider key={cookinger._id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className='flex flex-col items-center rounded-xl border border-red-200 bg-red-50 p-2 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-950/30 dark:hover:bg-red-900/40'>
                            <Avatar className='ring-2 ring-red-200 dark:ring-red-800'>
                              <AvatarImage src={cookinger.avatar} />
                              <AvatarFallback className='bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'>
                                {getAbbreviationName(cookinger.givenName || 'User')}
                              </AvatarFallback>
                            </Avatar>
                            <span className='mt-1 text-center text-xs font-medium text-red-700 dark:text-red-300'>
                              {cookinger.givenName}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {cookinger.familyName} {cookinger.givenName}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))
                ) : (
                  <div className='col-span-6 py-8 text-center'>
                    <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800'>
                      <ChefHat />
                    </div>
                    <p className='text-muted-foreground text-lg'>Chưa có lịch nấu cơm</p>
                    <p className='text-muted-foreground/70 text-sm'>Liên hệ ban điều hành để được phân công</p>
                  </div>
                )}
              </div>

              {/* Inspirational Quote */}
              <div className='mt-6 rounded-xl border border-yellow-200 bg-gradient-to-r from-yellow-100 to-amber-100 p-4 text-center dark:border-yellow-800 dark:from-yellow-900/40 dark:to-amber-900/40'>
                <p className='font-medium text-yellow-800 italic dark:text-yellow-200'>
                  💡 &quot;Ý thức càng cao, tự do càng nhiều!&quot;
                </p>
              </div>
            </Suspense>
          </div>
        </>
      )}
    </AppWrapper>
  )
}

export default CookingPage

export const CookingSkeleton = () => {
  return (
    <div className='flex w-full flex-col gap-4'>
      {/* Thực đơn */}
      <div className='flex flex-col gap-2'>
        <Skeleton className='h-6 w-32' /> {/* tiêu đề "Thực đơn" */}
        <Skeleton className='h-10 w-full rounded-md' />
        <Skeleton className='h-10 w-full rounded-md' />
        <Skeleton className='h-10 w-full rounded-md' />
      </div>

      {/* Số người ăn */}
      <div className='flex flex-col gap-2'>
        <Skeleton className='h-6 w-28' /> {/* tiêu đề "Số người ăn" */}
        <div className='flex justify-between'>
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-4 w-10' />
        </div>
        <div className='flex justify-between'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-4 w-10' />
        </div>
        <div className='flex justify-between'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-10' />
        </div>
      </div>

      {/* Danh sách ăn đúng giờ */}
      <div className='flex flex-col gap-2'>
        <Skeleton className='h-5 w-40' /> {/* tiêu đề */}
        <div className='grid grid-cols-6 gap-2'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className='flex flex-col items-center gap-1'
            >
              <Skeleton className='h-10 w-10 rounded-full' />
              <Skeleton className='h-3 w-12' />
            </div>
          ))}
        </div>
      </div>

      {/* Danh sách chừa cơm trễ */}
      <div className='flex flex-col gap-2'>
        <Skeleton className='h-5 w-40' /> {/* tiêu đề */}
        <div className='grid grid-cols-6 gap-2'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className='flex flex-col items-center gap-1'
            >
              <Skeleton className='h-10 w-10 rounded-full' />
              <Skeleton className='h-3 w-12' />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
