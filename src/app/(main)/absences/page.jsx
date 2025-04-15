import { useState, lazy, Suspense } from 'react'
import useFetch from '@/hooks/use-fetch'
import { mutate } from 'swr'
import { toast } from 'sonner'
import { getAccessToken, getUser } from '@/lib/auth'
import { buildUrl } from '@/lib/utils'
import { sendPush } from '@/lib/send-push'

import { Plus } from 'lucide-react'

import AppWrapper from '@/components/app-wrapper'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { AbsenceListSkeleton } from '@/components/absence-list'
const AbsenceForm = lazy(() => import('@/components/absence-form'))
const AbsenceList = lazy(() => import('@/components/absence-list'))

const AbsencesPage = () => {
  const user = getUser()
  const [formOpen, setFormOpen] = useState(false)

  const { data: absences } = useFetch(buildUrl('/me/absences'), { suspense: true })

  const handleFormSubmit = async (values) => {
    const accessToken = await getAccessToken()

    const res = await fetch(import.meta.env.VITE_API_BASE + '/me/absences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(values),
    })

    if (!res.ok) {
      toast.error(`Báo vắng thất bại.`, { description: `Mã lỗi: ${res.status}` })
      console.log(await res.json())

      return
    }

    toast.success(`Báo vắng thành công.`)
    mutate((key) => key.startsWith('/me/absences'))
    setFormOpen(false)

    await sendPush({ title: 'Báo vắng', body: `${user.familyName} ${user.givenName} xin ${values.title}` }, accessToken)
  }

  const handleFormReset = () => {
    setFormOpen(false)
  }

  return (
    <AppWrapper
      title='Báo vắng'
      className={'flex flex-col gap-4'}
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
              <DrawerTitle>Báo vắng</DrawerTitle>
            </DrawerHeader>
            <Suspense>
              <AbsenceForm
                onSubmit={handleFormSubmit}
                onReset={handleFormReset}
              />
            </Suspense>
          </div>
        </DrawerContent>
      </Drawer>

      <div className='flex flex-col gap-4 pb-16'>
        <Suspense fallback={<AbsenceListSkeleton />}>
          <AbsenceList absences={absences} />
        </Suspense>
      </div>
    </AppWrapper>
  )
}

export default AbsencesPage
