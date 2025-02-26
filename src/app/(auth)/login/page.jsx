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
    <section className='flex h-screen w-screen flex-col items-center justify-center'>
      <Button
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? <Loader className='animate-spin' /> : 'Đăng nhập bằng Google'}
      </Button>
    </section>
  )
}

export default LoginPage
