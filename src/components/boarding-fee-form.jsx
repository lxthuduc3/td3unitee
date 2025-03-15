import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'

import { boardingFeeSchema } from '@/schemas/boarding-fee-schema'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import DatePicker from '@/components/ext/date-picker'

const BoardingFeeForm = ({ defaultValues, onSubmit, onReset }) => {
  const form = useForm({
    resolver: zodResolver(boardingFeeSchema),
    defaultValues: !!defaultValues
      ? { ...defaultValues, date: format(defaultValues.date, 'yyyy-MM-dd') }
      : {
          desc: `Tiền nhà tháng ${format(new Date(), 'MM/yyyy')}`,
          amount: 1400000,
          date: format(new Date(), 'yyyy-MM-dd'),
        },
  })

  const handleFormSubmit = (values) => {
    onSubmit(values)
    form.reset()
  }

  const handleFormReset = () => {
    form.reset()
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
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex flex-row justify-end gap-2'>
          <Button type='submit'>Gửi</Button>

          <Button
            type='button'
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

export default BoardingFeeForm
