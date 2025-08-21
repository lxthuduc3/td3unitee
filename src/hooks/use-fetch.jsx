import useSWR from 'swr'
import fetcher from '@/lib/fetcher'

const useFetch = (endpoint, options = {}) => {
  const res = useSWR(endpoint, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: true,
    revalidateOnMount: true,
    ...options,
  })

  return res
}

export default useFetch
