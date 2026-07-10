import { googleLogout } from '@react-oauth/google'
import { unsetAuth } from '@/lib/auth'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'

const PendingPage = () => {
  const navigate = useNavigate()

  return (
    <section className='app-page-surface flex h-screen w-screen flex-col items-center justify-center gap-4 p-6 text-center'>
      <div className='w-full max-w-sm rounded-3xl border border-yellow-200 bg-card/90 p-8 shadow-xl backdrop-blur dark:border-yellow-800'>
      <img src={'/icon.png'} alt='TD3 Unitee' className='mx-auto aspect-square h-32 w-32 rounded-3xl bg-gradient-to-br from-yellow-300 to-amber-500 p-2 shadow-lg' />
      <h1 className='mt-6 text-2xl font-extrabold text-amber-950 dark:text-yellow-100'>Đang chờ xét duyệt</h1>
      <p className='mt-3 text-center text-muted-foreground'>Liên hệ ban điều hành để quá trình được thực hiện nhanh hơn.</p>
      <Button
        onClick={() => {
          googleLogout()
          unsetAuth()
          navigate('/login')
        }}
        variant='outline' className='mt-6 min-w-32 border-amber-300 bg-amber-50 text-center text-amber-900 hover:bg-yellow-100 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-200'
      >
        Đăng xuất
      </Button>
      <p className='mt-5 text-xs text-muted-foreground'>TD3 Unitee v{__APP_VERSION__}</p>
      </div>
    </section>
  )
}

export default PendingPage
