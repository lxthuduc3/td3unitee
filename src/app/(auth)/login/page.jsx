import { useState } from 'react'
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

  const login = useGoogleLogin({
    onSuccess: async ({ code }) => {
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
      }

      const { tokens, user } = await res.json()

      setAuth({ user, tokens })

      navigate(callbackUrl || '/')
    },
    onError: (error) => {
      toast.error('Đăng nhập thất bại')
      setLoading(false)
      console.log(error)
    },
    flow: 'auth-code',
  })

  const handleLogin = () => {
    setLoading(true)
    login()
  }

  return (
    <section className='flex h-screen w-screen flex-col items-center justify-center gap-4 p-4'>
      <img
        src={'/icon.png'}
        alt='icon'
        className='aspect-square h-40 w-40'
      />
      <h1 className='text-2xl font-bold'>TD3 Unitee v1.1.1</h1>
      <p>Hí anh em!</p>
      <Button
        onClick={handleLogin}
        disabled={loading}
        variant='outline'
        className='min-w-32 text-center'
      >
        {loading ? <Loader className='animate-spin' /> : 'Đăng nhập'}
      </Button>
    </section>
  )
}

export default LoginPage
