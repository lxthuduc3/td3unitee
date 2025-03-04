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
  const [date, setDate] = useState(new Date())
  const [meal, setMeal] = useState(() => (new Date().getHours() >= 12 ? 'dinner' : 'lunch'))

  const { data: menu } = useFetch(`/meals/${date.getDay()}/${meal}`, { suspense: true })

  const { data: eaters } = useFetch(`/meal-registrations/${format(date, 'yyyy-MM-dd')}/${meal}`, { suspense: true })

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

      <div className='flex w-full flex-col gap-4'>
        <h3 className='leading-none font-semibold tracking-tight'>Thực đơn</h3>
        <Suspense
          fallback={<span className='text-muted-foreground w-full animate-pulse text-center text-sm'>Đang tải...</span>}
        >
          <Accordion
            type='multiple'
            collapsible='true'
            className='w-full'
          >
            <AccordionItem value={menu?.mainDish?._id}>
              <AccordionTrigger>{menu?.mainDish?.name}</AccordionTrigger>
              <AccordionContent>{menu?.mainDish?.ingredients.map((i) => i.name).join(', ')}</AccordionContent>
            </AccordionItem>

            <AccordionItem value={menu?.vegie?._id}>
              <AccordionTrigger>{menu?.vegie?.name}</AccordionTrigger>
              <AccordionContent>{menu?.vegie?.ingredients.map((i) => i.name).join(', ')}</AccordionContent>
            </AccordionItem>

            <AccordionItem value={menu?.soup?._id}>
              <AccordionTrigger>{menu?.soup?.name}</AccordionTrigger>
              <AccordionContent>{menu?.soup?.ingredients.map((i) => i.name).join(', ')}</AccordionContent>
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
              I expect your attitude to be good; otherwise, this feature will be released, or even worse, you will no longer be
              able to cancel a meal!
            </span>
          </div>
        </Suspense>
      </div>
    </AppWrapper>
  )
}

export default CookingPage
