import { useState } from 'react'
import { useGoogleLogin, googleLogout } from '@react-oauth/google'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import AuthContext from '@/contexts/auth'

const isTokenExpired = (tokens) => {
  const currentTime = Date.now()
  return currentTime >= tokens.expiry_date
}

const refreshToken = async (tokens) => {
  const res = await fetch(import.meta.env.VITE_API_BASE + '/auth/google/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken: tokens.refresh_token }),
  })

  if (!res.ok) {
    console.log('[refreshToken]', res.status, await res.json())
    return null
  }

  return await res.json()
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      return storedUser ? JSON.parse(storedUser) : null
    }
  })

  const [tokens, setTokens] = useState(() => {
    const storedTokens = localStorage.getItem('tokens')
    if (storedTokens) {
      return storedTokens ? JSON.parse(storedTokens) : null
    }
  })

  const [searchParams] = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')
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

      if (!res.ok) {
        toast.error('Đăng nhập thất bại', { description: `Mã lỗi: ${res.status}` })
      }

      const { tokens, user } = await res.json()

      setUser(user)
      setTokens(tokens)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('tokens', JSON.stringify(tokens))

      navigate(callbackUrl || '/')
    },
    onError: (error) => {
      toast.error('Đăng nhập thất bại')
      console.log(error)
    },
    flow: 'auth-code',
  })

  const login = ({ callbackUrl }) => {
    googleLogin()
    navigate(callbackUrl || '/')
  }

  const logout = ({ callbackUrl }) => {
    googleLogout()
    setUser(null)
    setTokens(null)
    localStorage.removeItem('user')
    localStorage.removeItem('tokens')

    navigate(callbackUrl || '/')
  }

  const mutateTokens = (newTokens) => {
    setTokens(newTokens)
    localStorage.setItem('tokens', JSON.stringify(newTokens))
  }

  return <AuthContext.Provider value={{ tokens, user, login, logout, mutateTokens }}>{children}</AuthContext.Provider>
}

export default AuthProvider
