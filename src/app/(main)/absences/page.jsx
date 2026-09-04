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

  const isAdmin = user?.role === 'executiveBoard'

  const { data: absences } = useFetch(buildUrl('/me/absences'), { suspense: true })
  const { data: absencesadmin } = useFetch(isAdmin ? buildUrl('/absences/week') : null, { suspense: true })

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
      className='min-h-screen'
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

      <div className='flex flex-col gap-4 pb-20 pt-1'>
        <Suspense fallback={<AbsenceListSkeleton />}>
          {isAdmin && (
            <>
              {/* Admin Section */}
              <div className='overflow-hidden rounded-2xl border border-amber-200/60 bg-amber-50/60 shadow-sm dark:border-amber-700/30 dark:bg-amber-950/30'>
                <div className='flex items-center justify-between gap-4 border-b border-amber-200/50 px-4 py-3.5 dark:border-amber-700/30'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-sm shadow-amber-300/40 dark:from-yellow-500 dark:to-amber-600 dark:shadow-amber-800/30'>
                      👥
                    </div>
                    <div>
                      <h2 className='text-base font-semibold leading-tight text-amber-950 dark:text-amber-100'>Báo vắng của anh em trong tuần</h2>
                    </div>
                  </div>
                  <span className='rounded-full bg-white/80 px-3 py-1 text-sm font-semibold leading-none text-amber-700 shadow-sm ring-1 ring-amber-200/70 dark:bg-amber-900/40 dark:text-amber-200 dark:ring-amber-700/30'>
                    {absencesadmin?.absences?.length || 0}
                  </span>
                </div>
                <div className='bg-white/70 p-4 dark:bg-gray-900/30'>
                  <AbsenceList
                    absences={absencesadmin?.absences}
                    check={true}
                  />
                </div>
              </div>

              {/* Personal Section Header */}
              <div className='overflow-hidden rounded-2xl border border-amber-200/60 bg-amber-50/60 shadow-sm dark:border-amber-700/30 dark:bg-amber-950/30'>
                <div className='flex items-center justify-between gap-4 border-b border-amber-200/50 px-4 py-3.5 dark:border-amber-700/30'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-sm shadow-amber-300/40 dark:from-yellow-500 dark:to-amber-600 dark:shadow-amber-800/30'>
                      📝
                    </div>
                    <div>
                      <h2 className='text-base font-semibold leading-tight text-amber-950 dark:text-amber-100'>Báo vắng của bạn</h2>
                    </div>
                  </div>
                  <span className='rounded-full bg-white/80 px-3 py-1 text-sm font-semibold leading-none text-amber-700 shadow-sm ring-1 ring-amber-200/70 dark:bg-amber-900/40 dark:text-amber-200 dark:ring-amber-700/30'>
                    {absences?.length || 0}
                  </span>
                </div>
                <div className='bg-white/70 p-4 dark:bg-gray-900/30'>
                  <AbsenceList absences={absences} />
                </div>
              </div>
            </>
          )}

          {!isAdmin && (
            <div className='overflow-hidden rounded-2xl border border-amber-200/60 bg-amber-50/60 shadow-sm dark:border-amber-700/30 dark:bg-amber-950/30'>
              <div className='flex items-center justify-between gap-4 border-b border-amber-200/50 px-4 py-3.5 dark:border-amber-700/30'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-sm shadow-amber-300/40 dark:from-yellow-500 dark:to-amber-600 dark:shadow-amber-800/30'>
                    📝
                  </div>
                  <div>
                    <h2 className='text-base font-semibold leading-tight text-amber-950 dark:text-amber-100'>Lịch sử báo vắng</h2>
                  </div>
                </div>
                <span className='rounded-full bg-white/80 px-3 py-1 text-sm font-semibold leading-none text-amber-700 shadow-sm ring-1 ring-amber-200/70 dark:bg-amber-900/40 dark:text-amber-200 dark:ring-amber-700/30'>
                  {absences?.length || 0}
                </span>
              </div>
              <div className='bg-white/70 p-4 dark:bg-gray-900/30'>
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
