import { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useAuth from '@/hooks/use-auth'

import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react'

const LoginPage = () => {
  const [searchParams] = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')

  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      const res = await fetch(import.meta.env.VITE_API_BASE + '/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      const { tokens, user } = await res.json()

      login({ tokens, user })
      navigate(callbackUrl || '/')
    },
    flow: 'auth-code',
  })

  const handleLogin = () => {
    setLoading(true)
    googleLogin()
  }

  return (
    <section className='flex h-screen w-screen flex-col items-center justify-center gap-4 p-4'>
      <img
        src={'/icon.png'}
        alt='icon'
        className='aspect-square h-40 w-40'
      />
      <h1 className='text-2xl font-bold'>TD3 Unitee (βeta)</h1>
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
