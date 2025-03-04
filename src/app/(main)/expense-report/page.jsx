import { useState, lazy, Suspense } from 'react'
import { addDays, format } from 'date-fns'
import useFetch from '@/hooks/use-fetch'
import { mutate } from 'swr'
import { toast } from 'sonner'
import { transactionStatuses } from '@/lib/display-text'
import useAuth from '@/hooks/use-auth'
import { buildUrl } from '@/lib/utils'

import { Plus } from 'lucide-react'

import AppWrapper from '@/components/app-wrapper'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import DateRangePicker from '@/components/ext/date-range-picker'
import { ExpenseReportListSkeleton } from '@/components/expense-report-list'
const ExpenseReportList = lazy(() => import('@/components/expense-report-list'))
const ExpenseReportForm = lazy(() => import('@/components/expense-report-form'))

const ExpenseReportPage = () => {
  const { accessToken } = useAuth()

  const [formOpen, setFormOpen] = useState(false)
  const [status, setStatus] = useState('')
  const [date, setDate] = useState({
    from: addDays(new Date(), -7),
    to: new Date(),
  })

  const { data: expenses } = useFetch(
    buildUrl(
      '/me/expenses',
      { status, dateFrom: format(date?.from, 'yyyy-MM-dd'), dateTo: format(date?.to, 'yyyy-MM-dd') },
      { suspense: true }
    )
  )

  const handleFormSubmit = async (values) => {
    const res = await fetch(import.meta.env.VITE_API_BASE + '/me/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(values),
    })

    if (!res.ok) {
      toast.error(`Báo chi thất bại.`, { description: `Mã lỗi: ${res.status}` })
      console.log(await res.json())

      return
    }

    toast.success(`Báo chi thành công.`)
    mutate((key) => key.startsWith('/me/expenses'))
    setFormOpen(false)
  }

  const handleFormReset = () => {
    setFormOpen(false)
  }

  return (
    <AppWrapper
      title='Báo chi'
      className={'relative flex w-screen flex-col gap-4'}
    >
      <Drawer
        open={formOpen}
        onOpenChange={setFormOpen}
      >
        <DrawerTrigger asChild>
          <Button
            size='icon'
            className='fixed right-4 bottom-20 z-50 h-12 w-12 rounded-xl'
          >
            <Plus />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className='mx-auto w-full max-w-sm'>
            <DrawerHeader>
              <DrawerTitle>Khoản chi mới</DrawerTitle>
            </DrawerHeader>
            <Suspense>
              <ExpenseReportForm
                onSubmit={handleFormSubmit}
                onReset={handleFormReset}
              />
            </Suspense>
          </div>
        </DrawerContent>
      </Drawer>

      <div className='flex flex-col gap-4 pb-16'>
        <DateRangePicker
          date={date}
          setDate={setDate}
        />
        <Tabs
          value={status}
          onValueChange={setStatus}
        >
          <ScrollArea className='w-full'>
            <TabsList>
              <TabsTrigger value=''>Tất cả</TabsTrigger>
              {Object.keys(transactionStatuses).map((status) => (
                <TabsTrigger
                  key={`transactionStatus${status}`}
                  value={status}
                >
                  {transactionStatuses[status]}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar
              orientation='horizontal'
              className='hidden'
            />
          </ScrollArea>
        </Tabs>

        <Suspense fallback={<ExpenseReportListSkeleton />}>
          <ExpenseReportList expenses={expenses} />
        </Suspense>
      </div>
    </AppWrapper>
  )
}

export default ExpenseReportPage
