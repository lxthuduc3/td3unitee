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
    let body = null
    try {
      body = await res.json()
    } catch {
      // response has no/invalid JSON body
    }

    const error = new Error(body?.message || `Yêu cầu thất bại (mã lỗi: ${res.status})`)
    Object.assign(error, { status: res.status, body })

    throw error
  }

  return await res.json()
}

export default fetcher
