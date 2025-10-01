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
  const { data: absencesadmin } = useFetch(buildUrl('/absences/week'), { suspense: true })

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
      className='min-h-screen bg-gray-50 dark:bg-black'
    >
      <Drawer
        open={formOpen}
        onOpenChange={setFormOpen}
      >
        <DrawerTrigger asChild>
          <Button
            size='icon'
            className='fixed right-4 bottom-[calc(80px+env(safe-area-inset-bottom))] z-50 h-14 w-14 transform rounded-2xl border-2 border-white/20 bg-gradient-to-r from-yellow-500 to-amber-500 shadow-lg shadow-yellow-400/30 transition-all duration-300 hover:scale-110 hover:from-yellow-600 hover:to-amber-600 hover:shadow-xl hover:shadow-yellow-500/40'
          >
            <Plus className='h-6 w-6' />
          </Button>
        </DrawerTrigger>
        <DrawerContent className='border-t border-yellow-200 bg-white dark:border-yellow-800 dark:bg-black'>
          <div className='mx-auto w-full max-w-sm'>
            <DrawerHeader className='mx-4 mt-4 rounded-t-lg'>
              <DrawerTitle className='text-center text-lg font-semibold'>Tạo báo vắng mới</DrawerTitle>
            </DrawerHeader>
            <div className='p-4'>
              <Suspense>
                <AbsenceForm
                  onSubmit={handleFormSubmit}
                  onReset={handleFormReset}
                />
              </Suspense>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <div className='flex flex-col gap-6 pb-20'>
        <Suspense fallback={<AbsenceListSkeleton />}>
          {user?.role === 'executiveBoard' && (
            <>
              {/* Admin Section */}
              <div className='overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-lg dark:border-orange-800 dark:bg-gray-900'>
                <div className='bg-gradient-to-r from-orange-500 to-red-500 p-4'>
                  <h2 className='flex items-center gap-2 text-lg font-semibold text-white'>
                    👥 Báo vắng của anh em trong tuần
                    <span className='rounded-full bg-white/20 px-2 py-1 text-sm'>{absencesadmin?.absences?.length || 0}</span>
                  </h2>
                  <p className='mt-1 text-sm text-white/80'>Quản lý và phê duyệt đơn xin nghỉ</p>
                </div>
                <div className='p-4'>
                  <AbsenceList
                    absences={absencesadmin.absences}
                    check={true}
                  />
                </div>
              </div>

              {/* Personal Section Header */}
              <div className='overflow-hidden rounded-2xl border border-yellow-200 bg-white shadow-lg dark:border-yellow-800 dark:bg-gray-900'>
                <div className='bg-gradient-to-r from-yellow-500 to-amber-500 p-4'>
                  <h2 className='flex items-center gap-2 text-lg font-semibold text-white'>
                    📝 Báo vắng của bạn
                    <span className='rounded-full bg-white/20 px-2 py-1 text-sm'>{absences?.length || 0}</span>
                  </h2>
                  <p className='mt-1 text-sm text-white/80'>Lịch sử các lần báo vắng của bạn</p>
                </div>
                <div className='p-4'>
                  <AbsenceList absences={absences} />
                </div>
              </div>
            </>
          )}

          {user?.role !== 'executiveBoard' && (
            <div className='overflow-hidden rounded-2xl border border-yellow-200 bg-white shadow-lg dark:border-yellow-800 dark:bg-gray-900'>
              <div className='bg-gradient-to-r from-yellow-500 to-amber-500 p-4'>
                <h2 className='flex items-center gap-2 text-lg font-semibold text-white'>
                  📝 Lịch sử báo vắng
                  <span className='rounded-full bg-white/20 px-2 py-1 text-sm'>{absences?.length || 0}</span>
                </h2>
                <p className='mt-1 text-sm text-white/80'>Danh sách các lần báo vắng của bạn</p>
              </div>
              <div className='p-4'>
                <AbsenceList absences={absences} />
              </div>
            </div>
          )}
        </Suspense>
      </div>
    </AppWrapper>
  )
}

export default AbsencesPage
