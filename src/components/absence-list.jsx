import { format } from 'date-fns'
import { mutate } from 'swr'
import { toast } from 'sonner'
import { getAccessToken } from '@/lib/auth'
import { cn } from '@/lib/utils'

import { Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const AbsenceItem = ({ absence }) => {
  const handleCancel = async () => {
    const accessToken = await getAccessToken()

    const res = await fetch(import.meta.env.VITE_API_BASE + `/me/absences/${absence._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!res.ok) {
      toast.error(`Hủy báo vắng thất bại.`, { description: `Mã lỗi: ${res.status}` })
      console.log(await res.json())

      return
    }

    toast.success(`Hủy báo vắng thành công.`)
    mutate((key) => key.startsWith('/me/absences'))
  }

  return (
    <div
      key={absence._id}
      className='hover:bg-muted/50 relative flex flex-col gap-1 rounded-xl border p-2'
    >
      <div className='flex flex-row justify-between gap-2'>
        <div className={cn('font-bold', { 'text-muted-foreground line-through': absence.canceled })}>{absence.title}</div>
        {absence.canceled && <Badge variant='outline'>Đã hủy</Badge>}
      </div>
      <p className={cn({ 'text-muted-foreground line-through': absence.canceled })}>{absence.reason}</p>

      <time className={cn('text-xs font-medium', { 'text-muted-foreground line-through': absence.canceled })}>
        {format(absence.date, 'dd/MM/yyyy')}
      </time>

      <div className='absolute right-2 bottom-2 flex flex-row gap-2'>
        {!absence.canceled && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant='outline'
                size='icon'
              >
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận</AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này sẽ hủy báo vắng. Bạn có chắc chắn muốn thực hiện không?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancel}>Tiếp tục</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  )
}

const AbsenceList = ({ absences }) => {
  return (
    <div className='flex w-full flex-col gap-2'>
      {absences.length > 0 ? (
        absences.map((absence) => (
          <AbsenceItem
            key={absence._id}
            absence={absence}
          />
        ))
      ) : (
        <span className='text-muted-foreground w-full text-center text-sm italic'>Không có báo vắng</span>
      )}
    </div>
  )
}

export default AbsenceList

export const AbsenceListSkeleton = () => (
  <div className='flex w-full flex-col gap-2'>
    {Array.from({ length: 5 }).map((_, index) => (
      <div
        key={`AbsenceListSKeleton${index}`}
        className='hover:bg-muted/50 flex flex-col gap-1 rounded-xl border p-2'
      >
        <div className='flex flex-row justify-between gap-2'>
          <Skeleton className='h-6 w-20' />
          <Skeleton className='h-6 w-16' />
        </div>
        <Skeleton className='h-6 w-1/2' />
        <Skeleton className='h-4 w-16' />
      </div>
    ))}
  </div>
)
