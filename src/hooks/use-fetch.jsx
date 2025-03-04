import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import useAuth from '@/hooks/use-auth'

const useFetch = (endpoint, options = {}) => {
  const { accessToken } = useAuth()

  const res = useSWR(endpoint, (endpoint) => fetcher(endpoint, accessToken), {
    revalidateOnFocus: false,
    revalidateIfStale: true,
    revalidateOnMount: true,
    ...options,
  })

  return res
}

export default useFetch
