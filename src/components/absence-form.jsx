import { format } from 'date-fns'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { absenceSchema } from '@/schemas/absence-schema'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import DatePicker from '@/components/ext/date-picker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const AbsenceForm = ({ defaultValues, onSubmit, onReset }) => {
  const form = useForm({
    resolver: zodResolver(absenceSchema),
    defaultValues: !!defaultValues
      ? {
          ...defaultValues,
          date: new Date(defaultValues.date).toISOString(),
        }
      : {
          title: '',
          reason: '',
          date: new Date().toISOString(),
        },
  })

  const handleFormSubmit = (values) => {
    onSubmit(values)
    form.reset()
  }

  const handleFormReset = () => {
    form.reset()
    if (onReset) onReset()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className='flex flex-col gap-4 p-4'
      >
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn tiêu đề' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='Vắng kinh tối'>Vắng kinh tối</SelectItem>
                  <SelectItem value='Vắng họp nhà'>Vắng họp nhà</SelectItem>
                  <SelectItem value='Về trễ'>Về trễ</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='reason'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lý do</FormLabel>
              <FormControl>
                <Textarea
                  className='resize-none'
                  {...field}
                />
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
                date={field.value ? new Date(field.value) : undefined}
                onDateChange={(date) => {
                  field.onChange(format(date, 'dd/MM/yyyy'))
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

export default AbsenceForm
