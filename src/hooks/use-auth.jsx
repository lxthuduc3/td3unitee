import { useContext, useEffect, useCallback } from 'react'
import AuthContext from '../contexts/auth'
import { toast } from 'sonner'

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

const useAuth = () => {
  const context = useContext(AuthContext)

  if (context == undefined) {
    throw new Error('useAuth must be used within a AuthProvider')
  }

  const { tokens, mutateTokens, user, login, logout } = context

  const handleRefreshToken = useCallback(async () => {
    const newTokens = await refreshToken(tokens)

    if (newTokens) {
      mutateTokens(newTokens)
    } else {
      toast.error('Phiên đăng nhập đã hết hạn', { description: 'Vui lòng đăng nhập lại.' })
      logout({ callbackUrl: '/login' })
    }
  }, [tokens, logout, mutateTokens])

  useEffect(() => {
    if (tokens && isTokenExpired(tokens)) {
      handleRefreshToken()
    }
  }, [tokens, handleRefreshToken])

  return { user, accessToken: tokens?.id_token, login, logout }
}

export default useAuth
