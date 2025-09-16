import { mutate } from 'swr'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

const Error = ({ error }) => {
  console.log(error)

  const handleGoBack = () => {
    mutate(() => true, undefined, { revalidate: false })
    window.location.href = '/login'
  }

  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center gap-1'>
      <span className='font-doto text-6xl'>Error</span>
      <p>Đã có lỗi xảy ra</p>
      <pre className='border-destructive text-destructive-foreground w-[90%] rounded-lg border p-2 text-wrap'>
        {error.message || JSON.stringify(error)}
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
