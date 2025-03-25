'use client'

import { useState, lazy, Suspense } from 'react'
import currency from '@/lib/currency'
import { format } from 'date-fns'
import { mutate } from 'swr'
import { toast } from 'sonner'
import { getAccessToken } from '@/lib/auth'

import { transactionStatuses } from '@/lib/display-text'

import { Check, FilePenLine, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
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
const ExpenseReportForm = lazy(() => import('@/components/expense-report-form'))

const ExpenseReportItem = ({ expense }) => {
  const [formOpen, setFormOpen] = useState(false)

  const handleFormSubmit = async (values) => {
    const accessToken = await getAccessToken()

    const res = await fetch(import.meta.env.VITE_API_BASE + `/me/expenses/${expense._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(values),
    })

    if (!res.ok) {
      toast.error(`Chỉnh sửa phiếu báo chi thất bại.`, { description: `Mã lỗi: ${res.status}` })
      console.log(await res.json())

      return
    }

    toast.success(`Chỉnh sửa phiếu báo chi thành công.`)
    mutate((key) => key.startsWith('/me/expenses'))
    setFormOpen(false)
  }

  const handleFormReset = () => {
    setFormOpen(false)
  }

  const handleDelete = async () => {
    const accessToken = await getAccessToken()

    const res = await fetch(import.meta.env.VITE_API_BASE + `/me/expenses/${expense._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!res.ok) {
      toast.error(`Xóa phiếu báo chi thất bại.`, { description: `Mã lỗi: ${res.status}` })
      console.log(await res.json())

      return
    }

    toast.success(`Xóa phiếu báo chi thành công.`)
    mutate((key) => key.startsWith('/me/expenses'))
  }

  const handleConfirm = async () => {
    const accessToken = await getAccessToken()

    const res = await fetch(import.meta.env.VITE_API_BASE + `/me/expenses/${expense._id}/confirm`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!res.ok) {
      toast.error(`Xác nhận hoàn trả thất bại.`, { description: `Mã lỗi: ${res.status}` })
      console.log(await res.json())

      return
    }

    toast.success(`Xác nhận hoàn trả thành công.`)
    mutate((key) => key.startsWith('/me/expenses'))
    setFormOpen(false)
  }

  return (
    <div
      key={expense._id}
      className='hover:bg-muted/50 relative flex flex-col gap-1 rounded-xl border p-2'
    >
      <div className='flex flex-row justify-between gap-2'>
        <div className='text-destructive-foreground font-bold'>{currency.format(expense.amount)}</div>
        <Badge variant='outline'>{transactionStatuses[expense.status]}</Badge>
      </div>
      <p>{expense.desc}</p>

      <time className='text-xs font-medium'>{format(expense.date, 'dd/MM/yyyy')}</time>

      <div className='absolute right-2 bottom-2 flex flex-row gap-2'>
        {['pending', 'pendingReimbursement', 'rejected'].includes(expense.status) && (
          <>
            <Drawer
              open={formOpen}
              onOpenChange={setFormOpen}
            >
              <DrawerTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                >
                  <FilePenLine />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className='mx-auto w-full max-w-sm'>
                  <DrawerHeader>
                    <DrawerTitle>Chỉnh sửa khoản chi</DrawerTitle>
                  </DrawerHeader>
                  <Suspense>
                    <ExpenseReportForm
                      defaultValues={expense}
                      onSubmit={handleFormSubmit}
                      onReset={handleFormReset}
                    />
                  </Suspense>
                </div>
              </DrawerContent>
            </Drawer>

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
                    Hành động này sẽ xóa phiếu báo chi này khỏi hệ thống vĩnh viễn. Bạn có chắc chắn muốn thực hiện không?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Tiếp tục</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
        {expense.status == 'pendingConfirmation' && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant='outline'
                size='icon'
              >
                <Check />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận</AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này sẽ đánh dấu bạn đã nhận được hoàn trả và hoàn tất khoản chi. Bạn có chắc chắn muốn thực hiện
                  không?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirm}>Tiếp tục</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  )
}

const ExpenseReportList = ({ expenses = [] }) => {
  return (
    <div className='flex w-full flex-col gap-2'>
      {expenses.length != 0 ? (
        expenses.map((expense) => (
          <ExpenseReportItem
            key={expense._id}
            expense={expense}
          />
        ))
      ) : (
        <span className='text-muted-foreground w-full text-center text-sm italic'>Danh sách trống</span>
      )}
    </div>
  )
}

export default ExpenseReportList

export const ExpenseReportListSkeleton = () => (
  <div className='flex w-full flex-col gap-2'>
    {Array.from({ length: 5 }).map((_, index) => (
      <div
        key={`expenseReportListSKeleton${index}`}
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
