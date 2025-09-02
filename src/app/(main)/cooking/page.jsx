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

const CookingPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState(new Date())
  const [meal, setMeal] = useState(() => (new Date().getHours() >= 12 ? 'dinner' : 'lunch'))

  const { data: menu, mutate: refreshMenu } = useFetch(`/meals/${date.getDay()}/${meal}`, { suspense: true })
  const { data: eaters, mutate: refreshEaters } = useFetch(`/meal-registrations/${format(date, 'yyyy-MM-dd')}/${meal}`, {
    suspense: true,
  })

  const handleRefresh = async () => {
    try {
      setIsLoading(true)
      await Promise.all([refreshMenu(), refreshEaters()])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppWrapper
      title='Nấu cơm'
      className={'flex flex-col items-center gap-4'}
    >
      <DatePicker
        date={date}
        onDateChange={setDate}
        popoverPosition='center'
      />
      <Tabs
        value={meal}
        onValueChange={setMeal}
      >
        <TabsList>
          <TabsTrigger value='lunch'>Bữa trưa</TabsTrigger>
          <TabsTrigger value='dinner'>Bữa tối</TabsTrigger>
        </TabsList>
      </Tabs>
      {isLoading ? (
        <span className='text-muted-foreground w-full animate-pulse text-center text-sm italic'>Đang tải...</span>
      ) : (
        <>
          <div className='flex w-full flex-col gap-4'>
            <div className='flex w-full items-center justify-between'>
              <h3 className='leading-none font-semibold tracking-tight'>Thực đơn</h3>
              <button
                onClick={handleRefresh}
                className='hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-md p-2'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='size-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99'
                  />
                </svg>
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

          <div className='flex w-full flex-col gap-4'>
            <h3 className='leading-none font-semibold tracking-tight'>Số người ăn</h3>
            <Suspense
              fallback={<span className='text-muted-foreground w-full animate-pulse text-center text-sm'>Đang tải...</span>}
            >
              <div className='flex flex-col gap-2'>
                <div className='flex flex-row justify-between'>
                  <span className='font-medium'>Tổng:</span>
                  <span>{eaters?.length} phần</span>
                </div>
                <div className='flex flex-row justify-between'>
                  <span className='font-medium'>Ăn đúng giờ:</span>
                  <span>{eaters?.filter((e) => !e.late).length} phần</span>
                </div>
                <div className='flex flex-row justify-between'>
                  <span className='font-medium'>Chừa cơm trễ:</span>
                  <span>{eaters?.filter((e) => e.late).length} phần</span>
                </div>
              </div>

              <h4 className='font-medium'>Danh sách ăn đúng giờ</h4>
              <div className='grid grid-cols-6 gap-2'>
                {eaters
                  ?.filter((e) => !e.late)
                  .map((eater) => (
                    <TooltipProvider key={eater.user._id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className='flex flex-col items-center'>
                            <Avatar>
                              <AvatarImage src={eater.user.avatar} />
                              <AvatarFallback>{getAbbreviationName(eater.user.givenName || 'User')}</AvatarFallback>
                            </Avatar>
                            <span className='text-center text-xs text-nowrap whitespace-nowrap'>{eater.user.givenName}</span>
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

              <h4 className='font-medium'>Danh sách chừa cơm trễ</h4>
              <div className='grid grid-cols-6 gap-2'>
                {eaters
                  ?.filter((e) => e.late)
                  .map((eater) => (
                    <TooltipProvider key={eater.user._id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className='flex flex-col items-center'>
                            <Avatar>
                              <AvatarImage src={eater.user.avatar} />
                              <AvatarFallback>{getAbbreviationName(eater.user.givenName || 'User')}</AvatarFallback>
                            </Avatar>
                            <span className='text-center text-xs text-nowrap whitespace-nowrap'>{eater.user.givenName}</span>
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

              <h4 className='font-medium'>Danh sách hủy cơm</h4>
              <div>
                <span className='text-muted-foreground w-full text-sm italic'>
                  &quot;Ý thức càng cao, tự do càng nhiều!&quot;
                </span>
              </div>
            </Suspense>
          </div>
        </>
      )}
    </AppWrapper>
  )
}

export default CookingPage
