import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { googleLogout } from '@react-oauth/google'
import { toast } from 'sonner'
import { setAuth, getAccessToken, unsetAuth } from '@/lib/auth'

import { Button } from '@/components/ui/button'
import { Loader, Home, ChevronRight } from 'lucide-react'

const SelectHomePage = () => {
  const [searchParams] = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')
  const navigate = useNavigate()

  const [homes, setHomes] = useState(null)
  const [loadingHomes, setLoadingHomes] = useState(true)
  const [selectingId, setSelectingId] = useState(null)

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_BASE + '/homes')

        if (!res.ok) {
          toast.error('Không tải được danh sách nhà', { description: `Mã lỗi: ${res.status}` })
          return
        }

        setHomes(await res.json())
      } catch (error) {
        toast.error('Không tải được danh sách nhà', { description: 'Lỗi kết nối' })
        console.log(error)
      } finally {
        setLoadingHomes(false)
      }
    }

    fetchHomes()
  }, [])

  const handleSelect = async (home) => {
    if (selectingId) return
    setSelectingId(home._id)

    try {
      const idToken = await getAccessToken()

      const res = await fetch(import.meta.env.VITE_API_BASE + '/auth/select-home', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ homeId: home._id }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 400) {
          toast.error('Không thể chọn nhà', { description: data?.message || 'Tài khoản đã được duyệt' })
        } else if (res.status === 404) {
          toast.error('Không thể chọn nhà', { description: 'Nhà không tồn tại hoặc đã ngừng hoạt động' })
        } else {
          toast.error('Không thể chọn nhà', { description: `Mã lỗi: ${res.status}` })
        }
        return
      }

      const storedTokens = localStorage.getItem('tokens')
      setAuth({ user: data.user, tokens: storedTokens ? JSON.parse(storedTokens) : null })

      toast.success('Đã chọn nhà', { description: data?.message })
      navigate(callbackUrl || '/pending')
    } catch (error) {
      toast.error('Không thể chọn nhà', { description: 'Lỗi kết nối' })
      console.log(error)
    } finally {
      setSelectingId(null)
    }
  }

  return (
    <section className='app-page-surface flex h-screen w-screen flex-col items-center justify-center gap-4 p-6'>
      <div className='w-full max-w-sm rounded-3xl border border-yellow-200 bg-card/90 p-8 shadow-xl backdrop-blur dark:border-yellow-800'>
        <img src={'/icon.png'} alt='TD3 Unitee' className='mx-auto aspect-square h-20 w-20 rounded-2xl bg-gradient-to-br from-yellow-300 to-amber-500 p-2 shadow-lg' />
        <h1 className='mt-6 text-center text-2xl font-extrabold text-amber-950 dark:text-yellow-100'>Chọn nhà của bạn</h1>
        <p className='mt-2 text-center text-sm text-muted-foreground'>Chọn nhà bạn đang sinh hoạt để tiếp tục. Sau khi chọn, quản trị viên của nhà sẽ duyệt tài khoản.</p>

        <div className='mt-6 flex flex-col gap-2'>
          {loadingHomes && (
            <div className='flex items-center justify-center py-8'>
              <Loader className='animate-spin text-muted-foreground' />
            </div>
          )}

          {!loadingHomes && homes?.length === 0 && <p className='py-8 text-center text-sm text-muted-foreground'>Chưa có nhà nào được thiết lập.</p>}

          {!loadingHomes &&
            homes?.map((home) => (
              <button
                key={home._id}
                onClick={() => handleSelect(home)}
                disabled={!!selectingId}
                className='flex w-full items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left transition hover:bg-yellow-100 disabled:opacity-60 dark:border-amber-800 dark:bg-amber-950/30 dark:hover:bg-amber-950/50'
              >
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-400/80 text-amber-950'>
                  <Home className='h-5 w-5' />
                </div>
                <div className='flex-1'>
                  <p className='font-semibold text-amber-950 dark:text-yellow-100'>{home.name}</p>
                  {home.address && <p className='text-xs text-muted-foreground'>{home.address}</p>}
                </div>
                {selectingId === home._id ? <Loader className='h-4 w-4 animate-spin text-amber-700' /> : <ChevronRight className='h-4 w-4 text-amber-700' />}
              </button>
            ))}
        </div>

        <Button
          onClick={() => {
            googleLogout()
            unsetAuth()
            navigate('/login')
          }}
          variant='ghost'
          className='mt-6 w-full text-muted-foreground'
        >
          Đăng xuất
        </Button>
      </div>
    </section>
  )
}

export default SelectHomePage
