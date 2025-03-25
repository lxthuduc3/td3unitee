import { getAccessToken } from './auth'

const fetcher = async (endpoint) => {
  const accessToken = await getAccessToken()

  const res = await fetch(`${import.meta.env.VITE_API_BASE}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) {
    const message = await res.json()
    const error = new Error('Failed to fetch in fetcher')
    Object.assign(error, { status: res.status, message })

    throw error
  }

  return await res.json()
}

export default fetcher
