import * as React from 'react'
import { format, setYear, setMonth, getYear, getMonth } from 'date-fns'
import { vi } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const DatePicker = ({
  date,
  onDateChange,
  min = new Date(1990, 1, 1),
  max = new Date(),
  className,
  popoverPosition = 'start',
}) => {
  const [selectMonth, setSelectMonth] = React.useState(new Date(getYear(date), getMonth(date)))

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn('justify-start text-left font-normal', !date && 'text-muted-foreground', className)}
        >
          <CalendarIcon />
          {date ? format(date, 'dd/MM/yyyy') : <span>Chọn một ngày</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={popoverPosition}
        className='flex w-auto flex-col space-y-2 p-2'
      >
        <div className='flex flex-row gap-2'>
          <Select
            value={getYear(date)}
            onValueChange={(value) => {
              onDateChange(setYear(new Date(date), parseInt(value)))
              setSelectMonth(setYear(new Date(selectMonth), parseInt(value)))
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder='Năm' />
            </SelectTrigger>
            <SelectContent position='popper'>
              {Array.from({ length: getYear(max) - getYear(min) + 1 }, (_, i) => getYear(min) + i).map((year) => (
                <SelectItem
                  key={`year${year}`}
                  value={year}
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={getMonth(date)}
            onValueChange={(value) => {
              onDateChange(setMonth(new Date(date), parseInt(value)))
              setSelectMonth(setMonth(new Date(selectMonth), parseInt(value)))
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder='Tháng' />
            </SelectTrigger>
            <SelectContent position='popper'>
              {Array.from({ length: 12 }, (_, i) => i).map((month) => (
                <SelectItem
                  key={`month${month}`}
                  value={month}
                >
                  Tháng {month + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='rounded-md border'>
          <Calendar
            mode='single'
            month={selectMonth}
            onMonthChange={setSelectMonth}
            selected={date}
            onSelect={onDateChange}
            locale={vi}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker
