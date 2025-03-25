const isTokenExpired = (tokens) => {
  const currentTime = Date.now()
  return currentTime >= tokens.expiry_date
}

export const setAuth = ({ user, tokens }) => {
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('tokens', JSON.stringify(tokens))
}

export const unsetAuth = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('tokens')
}

export const getUser = () => {
  const storedUser = localStorage.getItem('user')
  if (!storedUser) {
    return null
  } else {
    return JSON.parse(storedUser)
  }
}

export const getAuthStatus = () => {
  const storedTokens = localStorage.getItem('tokens')
  const storedUser = localStorage.getItem('user')

  if (!storedTokens || !storedUser || storedTokens == 'undefined' || storedUser == 'undefined') {
    return 'unauthenticated'
  }

  const tokens = JSON.parse(storedTokens)
  return isTokenExpired(tokens) ? 'expired' : 'authenticated'
}

export const getAccessToken = async () => {
  const storedTokens = localStorage.getItem('tokens')
  if (!storedTokens) {
    return null
  } else {
    const tokens = JSON.parse(storedTokens)

    if (isTokenExpired(tokens)) {
      const newTokens = await refreshToken(tokens)

      return newTokens.id_token
    }

    return tokens.id_token
  }
}

export const refreshToken = async (tokens) => {
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

  const newTokens = await res.json()
  localStorage.setItem('tokens', JSON.stringify(newTokens))

  return newTokens
}
