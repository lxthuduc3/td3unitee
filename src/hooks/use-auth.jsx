import { useContext, useEffect, useState } from 'react'
import AuthContext from '../contexts/auth'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()

  const context = useContext(AuthContext)

  if (context == undefined) {
    throw new Error('useAuth must be used within a AuthProvider')
  }

  const { tokens, mutateTokens, user, login, logout } = context

  const handleRefreshToken = async () => {
    if (tokens && isTokenExpired(tokens) && !isRefreshing) {
      console.log('refresh called')
      const newTokens = await refreshToken(tokens)

      if (newTokens) {
        mutateTokens(newTokens)
      } else {
        toast.error('Phiên đăng nhập đã hết hạn', { description: 'Vui lòng đăng nhập lại.' })
        navigate('/login')
      }
    }
  }

  handleRefreshToken()

  return { user, accessToken: tokens?.id_token, login, logout }
}

export default useAuth
