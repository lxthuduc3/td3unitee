import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import { mutate } from 'swr'
import { getAccessToken } from '@/lib/auth'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import profileSchema from '@/schemas/profile-schema'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import DatePicker from '@/components/ext/date-picker'

const ProfileForm = ({ currentProfile }) => {
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      baptismalName: currentProfile.baptismalName || '',
      dateOfBirth: format(currentProfile.dateOfBirth || new Date(), 'yyyy-MM-dd'),
      phone: currentProfile.phone || '',
      facebook: currentProfile.facebook || '',
      hometown: currentProfile.hometown || '',
      school: currentProfile.school || '',
      firstSchoolYear: currentProfile.firstSchoolYear || '',
      major: currentProfile.major || '',
    },
  })

  const onSubmit = async (values) => {
    const accessToken = await getAccessToken()

    const res = await fetch(import.meta.env.VITE_API_BASE + '/me/profile/edit', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(values),
    })

    if (!res.ok) {
      toast.error(`Cập nhật hồ sơ thất bại.`, { description: `Mã lỗi: ${res.status}` })
      console.log(await res.json())

      return
    }

    toast.success(`Cập nhật hồ sơ thành công.`)
    mutate('/me/profile')
    navigate('/profile')
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-4'
      >
        <FormField
          control={form.control}
          name='baptismalName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên thánh</FormLabel>
              <FormControl>
                <Input
                  placeholder='Raymunđô'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='dateOfBirth'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sinh nhật</FormLabel>
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

        <FormField
          control={form.control}
          name='hometown'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quê quán</FormLabel>
              <FormControl>
                <Input
                  placeholder='Tỉnh'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='school'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trường</FormLabel>
              <FormControl>
                <Input
                  placeholder='Tên trường'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='major'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chuyên ngành</FormLabel>
              <FormControl>
                <Input
                  placeholder='Tên chuyên ngành'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='firstSchoolYear'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Khóa</FormLabel>
              <FormControl>
                <Input
                  placeholder='Năm vào trường'
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
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input
                  placeholder='0987654321'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='facebook'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Liên kết facebook</FormLabel>
              <FormControl>
                <Input
                  placeholder='Liên kết đến trang cá nhân'
                  type='url'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>Cập nhật</Button>
      </form>
    </Form>
  )
}

export default ProfileForm

export const ProfileFormSkeleton = () => {
  return (
    <div className='flex flex-col gap-4'>
      {['Tên thánh', 'Sinh nhật', 'Quê quán', 'Trường', 'Chuyên ngành', 'Khóa', 'Số điện thoại', 'Liên kết facebook'].map(
        (label, index) => (
          <div
            key={index}
            className='space-y-2'
          >
            <Skeleton className='h-4 w-[100px]' />
            <Skeleton className='h-10 w-full' />
          </div>
        )
      )}
      <Skeleton className='h-10 w-full' />
    </div>
  )
}
