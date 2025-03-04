'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'

import { expenseReportSchema } from '@/schemas/expense-report-schema'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import DatePicker from '@/components/ext/date-picker'

const ExpenseReportForm = ({ defaultValues, onSubmit, onReset }) => {
  const form = useForm({
    resolver: zodResolver(expenseReportSchema),
    defaultValues: !!defaultValues
      ? { ...defaultValues, date: format(defaultValues.date, 'yyyy-MM-dd'), funded: defaultValues.status == 'pending' }
      : {
          desc: '',
          amount: 0,
          date: format(new Date(), 'yyyy-MM-dd'),
          funded: false,
        },
  })

  const handleFormSubmit = (values) => {
    onSubmit(values)
  }

  const handleFormReset = () => {
    if (!!onReset) onReset()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className='flex flex-col gap-4 p-4'
      >
        <FormField
          control={form.control}
          name='amount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số tiền</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='desc'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='date'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày</FormLabel>
              <DatePicker
                date={new Date(field.value)}
                onDateChange={(date) => {
                  field.onChange(format(date, 'yyyy-MM-dd'))
                }}
                popoverPosition='center'
              />
              {/* <FormControl>
                <Input
                  type='date'
                  {...field}
                />
              </FormControl> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='funded'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='flex flex-row items-center gap-2'>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id='funded'
                  />
                  <Label htmlFor='funded'>Đã nhận tiền từ quản lý</Label>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <div className='flex flex-row justify-end gap-2'>
          <Button type='submit'>Gửi</Button>

          <Button
            variant='secondary'
            onClick={handleFormReset}
          >
            Hủy
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ExpenseReportForm
