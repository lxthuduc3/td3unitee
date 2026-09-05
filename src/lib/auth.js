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

const normalizeText = (value) => {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
}

const findDefaultHome = (homes, homeNumber) => {
  const normalizedHomeLabel = normalizeText(`nha${homeNumber}`)

  return (
    homes.find((home) => Number(home?.number) === Number(homeNumber)) ||
    homes.find((home) => normalizeText(home?.name) === normalizedHomeLabel) ||
    homes.find((home) => normalizeText(home?.name).includes(String(homeNumber))) ||
    null
  )
}

export const selectDefaultHome = async ({ homeNumber = 3, tokens } = {}) => {
  const idToken = tokens?.id_token || (await getAccessToken())
  if (!idToken) {
    return { ok: false, reason: 'missing_token' }
  }

  const homesRes = await fetch(import.meta.env.VITE_API_BASE + '/homes')
  if (!homesRes.ok) {
    return { ok: false, reason: 'homes_fetch_failed', status: homesRes.status }
  }

  const homes = await homesRes.json()
  const defaultHome = findDefaultHome(homes || [], homeNumber)

  if (!defaultHome?._id) {
    return { ok: false, reason: 'default_home_not_found' }
  }

  const selectRes = await fetch(import.meta.env.VITE_API_BASE + '/auth/select-home', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ homeId: defaultHome._id }),
  })

  const data = await selectRes.json().catch(() => null)
  if (!selectRes.ok) {
    return { ok: false, reason: 'select_home_failed', status: selectRes.status, data }
  }

  const storedTokens = localStorage.getItem('tokens')
  const authTokens = tokens || (storedTokens ? JSON.parse(storedTokens) : null)

  setAuth({ user: data?.user, tokens: authTokens })

  return { ok: true, user: data?.user, home: defaultHome }
}
