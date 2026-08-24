import { mutate } from 'swr'
import { googleLogout } from '@react-oauth/google'
import { unsetAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

const Error = ({ error }) => {
  console.log(error)

  // Chỉ đăng xuất khi lỗi thực sự do phiên đăng nhập hết hạn/không hợp lệ (401/403).
  // Các lỗi khác (404, lỗi mạng, lỗi dữ liệu...) không nên bắt người dùng đăng nhập lại.
  const isAuthError = error?.status === 401 || error?.status === 403

  const handleGoBack = () => {
    mutate(() => true, undefined, { revalidate: false })

    if (isAuthError) {
      googleLogout()
      unsetAuth()
      window.location.href = '/login'
    } else {
      window.location.href = '/'
    }
  }

  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center gap-1'>
      <span className='font-doto text-6xl'>Error</span>
      <p>Đã có lỗi xảy ra</p>
      <pre className='border-destructive text-destructive-foreground w-[90%] rounded-lg border p-2 text-wrap'>
        {error?.message || JSON.stringify(error)}
      </pre>
      <Button
        variant='outline'
        onClick={handleGoBack}
      >
        <ArrowLeft />
        Quay lại
      </Button>
    </div>
  )
}

export default Error
