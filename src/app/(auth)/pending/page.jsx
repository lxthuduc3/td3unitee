import useAuth from '@/hooks/use-auth'

import { Button } from '@/components/ui/button'

const PendingPage = () => {
  const { logout } = useAuth()

  return (
    <section className='flex h-screen w-screen flex-col items-center justify-center gap-4 p-4'>
      <img
        src={'/icon.png'}
        alt='icon'
        className='aspect-square h-40 w-40'
      />
      <h1 className='text-2xl font-bold'>TD3 Unitee (βeta)</h1>
      <p className='text-center'>Đang xét duyệt. Liên hệ ban điều hành để quá trình được thực hiện nhanh hơn.</p>
      <Button
        onClick={logout({ callbackUrl: '/login' })}
        variant='outline'
        className='min-w-32 text-center'
      >
        Đăng xuất
      </Button>
    </section>
  )
}

export default PendingPage
