import { useState, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { toast } from 'sonner'
import { setAuth } from '@/lib/auth'

import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react'

const LoginPage = () => {
  const [searchParams] = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const timeoutRef = useRef(null)

  const login = useGoogleLogin({
    onSuccess: async ({ code }) => {
      // Clear timeout khi có response
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      try {
        const res = await fetch(import.meta.env.VITE_API_BASE + '/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        })

        if (!res.ok) {
          toast.error('Đăng nhập thất bại', { description: `Mã lỗi: ${res.status}` })
          setLoading(false)
          return
        }

        const { tokens, user, needsHomeSelection } = await res.json()

        setAuth({ user, tokens })

        if (needsHomeSelection) {
          navigate(`/select-home${callbackUrl ? `?callbackUrl=${callbackUrl}` : ''}`)
        } else {
          navigate(callbackUrl || '/')
        }
      } catch (error) {
        toast.error('Đăng nhập thất bại', { description: 'Lỗi kết nối' })
        setLoading(false)
        console.log(error)
      }
    },
    onError: (error) => {
      // Clear timeout khi có lỗi
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      toast.error('Đăng nhập thất bại')
      setLoading(false)
      console.log(error)
    },
    flow: 'auth-code',
  })

  const handleLogin = () => {
    setLoading(true)

    // Timeout sau 30 giây nếu không có response
    timeoutRef.current = setTimeout(() => {
      setLoading(false)
      toast.error('Đăng nhập thất bại', { description: 'Quá thời gian chờ' })
    }, 30000)

    try {
      login()
    } catch {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      setLoading(false)
      toast.error('Đăng nhập thất bại', { description: 'Không thể khởi tạo đăng nhập' })
    }
  }

  return (
    <section className='app-page-surface flex h-screen w-screen items-center justify-center p-5 pt-[calc(env(safe-area-inset-top)+1.25rem)] pb-[calc(env(safe-area-inset-bottom)+1.25rem)]'>
      <div className='w-full max-w-sm p-8 text-center'>
        <div className='mx-auto mb-6 w-fit'>
          <img src={'/icon.png'} alt='TD Unitee' className='aspect-square h-32 w-32' />
        </div>
        <h1 className='text-2xl font-extrabold text-amber-950 dark:text-yellow-100'>TD Unitee</h1>
        <p className='mt-2 text-sm text-muted-foreground'>Kết nối anh em, sẻ chia đời sống</p>
        <p className='mt-6 font-semibold text-amber-800 dark:text-amber-300'>Hí anh em! 👋</p>
        <Button onClick={handleLogin} disabled={loading} className='mt-6 h-11 w-full rounded-xl bg-yellow-400 font-bold text-amber-950 hover:bg-yellow-500'>
          {loading ? <Loader className='animate-spin' /> : 'Đăng nhập với Google'}
        </Button>
        <p className='mt-5 text-xs text-muted-foreground'>Phiên bản {__APP_VERSION__}</p>
      </div>
    </section>
  )
}

export default LoginPage
