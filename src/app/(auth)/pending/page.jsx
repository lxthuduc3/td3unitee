import { googleLogout } from '@react-oauth/google'
import { unsetAuth } from '@/lib/auth'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'

const PendingPage = () => {
  const navigate = useNavigate

  return (
    <section className='flex h-screen w-screen flex-col items-center justify-center gap-4 p-4'>
      <img
        src={'/icon.png'}
        alt='icon'
        className='aspect-square h-40 w-40'
      />
      <h1 className='text-2xl font-bold'>TD3 Unitee v1.3.0</h1>
      <p className='text-center'>Đang xét duyệt. Liên hệ ban điều hành để quá trình được thực hiện nhanh hơn.</p>
      <Button
        onClick={() => {
          googleLogout()
          unsetAuth()
          navigate('/login')
        }}
        variant='outline'
        className='min-w-32 text-center'
      >
        Đăng xuất
      </Button>
    </section>
  )
}

export default PendingPage
