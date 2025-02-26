import useTheme from '@/hooks/use-theme'

import { Sun, Moon, SunMoon } from 'lucide-react'

import AppWrapper from '@/components/app-wrapper'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

const SettingsPage = () => {
  const { theme, setTheme } = useTheme()
  return (
    <AppWrapper
      title='Cài đặt'
      className={'flex flex-col gap-2'}
    >
      <div className='text-card-foreground flex flex-row items-center justify-between gap-2'>
        <Label
          htmlFor='themeSelect'
          className='font-semibold'
        >
          Giao diện
        </Label>
        <Select
          onValueChange={(value) => setTheme(value)}
          value={theme}
          className='w-fit'
        >
          <SelectTrigger
            id='themeSelect'
            className='w-fit'
          >
            <SelectValue placeholder='Chọn chủ đề' />
          </SelectTrigger>
          <SelectContent position='popper'>
            <SelectItem value='light'>
              <span className='flex flex-row items-center gap-1'>
                <Sun
                  width={16}
                  height={16}
                />
                Sáng
              </span>
            </SelectItem>
            <SelectItem value='dark'>
              <span className='flex flex-row items-center gap-1'>
                <Moon
                  width={16}
                  height={16}
                />
                Tối
              </span>
            </SelectItem>
            <SelectItem value='system'>
              <span className='flex flex-row items-center gap-1'>
                <SunMoon
                  width={16}
                  height={16}
                />
                Tự động
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </AppWrapper>
  )
}

export default SettingsPage
