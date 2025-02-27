import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import useAuth from '@/hooks/use-auth'

import { format } from 'date-fns'

const isTokenExpired = (expirationTime) => {
  const currentTime = Date.now()
  return currentTime >= expirationTime
}

const refreshToken = async (tokens, mutate) => {
  const res = await fetch(import.meta.env.VITE_API_BASE + '/auth/google/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken: tokens.refresh_token }),
  })

  if (!res.ok) {
    console.log('[refreshToken]', res.status, await res.json())
    return
  }

  mutate({ tokens: await res.json() })
}

const useFetch = (endpoint, options = {}) => {
  const { tokens, mutate } = useAuth()

  if (isTokenExpired(tokens.expiry_date)) {
    refreshToken(tokens, mutate)
  }
  const accessToken = tokens.id_token

  const res = useSWR(endpoint, (endpoint) => fetcher(endpoint, accessToken), {
    revalidateOnFocus: false,
    revalidateIfStale: true,
    revalidateOnMount: true,
    ...options,
  })

  return res
}

export default useFetch
