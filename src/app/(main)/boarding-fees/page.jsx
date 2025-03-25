import { useState, lazy, Suspense } from 'react'
import useFetch from '@/hooks/use-fetch'
import { mutate } from 'swr'
import { toast } from 'sonner'
import { transactionStatuses } from '@/lib/display-text'
import { getAccessToken } from '@/lib/auth'
import { buildUrl } from '@/lib/utils'

import { Plus } from 'lucide-react'

import AppWrapper from '@/components/app-wrapper'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { BoardingFeeListSkeleton } from '@/components/boarding-fee-list'
const BoardingFeeForm = lazy(() => import('@/components/boarding-fee-form'))
const BoardingFeeList = lazy(() => import('@/components/boarding-fee-list'))

const BoardingFeePage = () => {
  const [formOpen, setFormOpen] = useState(false)
  const [status, setStatus] = useState('')

  const { data: boardingFees } = useFetch(buildUrl('/me/boarding-fees', { status }), { suspense: true })

  const handleFormSubmit = async (values) => {
    const accessToken = await getAccessToken()

    const res = await fetch(import.meta.env.VITE_API_BASE + '/me/boarding-fees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(values),
    })

    if (!res.ok) {
      toast.error(`Yêu cầu xác nhận tiền nhà thất bại.`, { description: `Mã lỗi: ${res.status}` })
      console.log(await res.json())

      return
    }

    toast.success(`Yêu cầu xác nhận tiền nhà thành công.`)
    mutate((key) => key.startsWith('/me/boarding-fees'))
    setFormOpen(false)
  }

  const handleFormReset = () => {
    setFormOpen(false)
  }

  return (
    <AppWrapper
      title='Xác nhận tiền nhà'
      className={'relative flex w-screen flex-col gap-4'}
    >
      <Drawer
        open={formOpen}
        onOpenChange={setFormOpen}
      >
        <DrawerTrigger asChild>
          <Button
            size='icon'
            className='fixed right-4 bottom-[calc(80px+env(safe-area-inset-bottom))] z-50 h-12 w-12 rounded-xl'
          >
            <Plus />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className='mx-auto w-full max-w-sm'>
            <DrawerHeader>
              <DrawerTitle>Yêu cầu mới</DrawerTitle>
            </DrawerHeader>
            <Suspense>
              <BoardingFeeForm
                onSubmit={handleFormSubmit}
                onReset={handleFormReset}
              />
            </Suspense>
          </div>
        </DrawerContent>
      </Drawer>

      <div className='flex flex-col items-center gap-4 pb-16'>
        <Tabs
          value={status}
          onValueChange={setStatus}
        >
          <ScrollArea className='w-full'>
            <TabsList>
              <TabsTrigger value=''>Tất cả</TabsTrigger>
              {['pending', 'completed', 'rejected'].map((status) => (
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
        <Suspense fallback={<BoardingFeeListSkeleton />}>
          <BoardingFeeList boardingFees={boardingFees} />
        </Suspense>
      </div>
    </AppWrapper>
  )
}

export default BoardingFeePage
