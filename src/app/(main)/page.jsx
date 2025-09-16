import { cn } from '@/lib/utils'

import { BookUser, CookingPot, ReceiptText, ShoppingCart, BookText, Calendar1 } from 'lucide-react'
import FiRrHouseLeave from '@/components/flaticons/fi-rr-house-leave'
import FiRrSalad from '@/components/flaticons/fi-rr-salad'

import AppWrapper from '@/components/app-wrapper'
import { Link } from 'react-router-dom'
import useFetch from '@/hooks/use-fetch'
import { isToday, isPast, format } from 'date-fns'

const tools = [
  { name: 'Nấu cơm', url: '/cooking', icon: CookingPot },
  { name: 'Đi chợ', url: '/shopping', icon: ShoppingCart },
  { name: 'Thực đơn', url: '/meals', icon: FiRrSalad },
  { name: 'XN tiền nhà', url: '/boarding-fees', icon: ReceiptText },
  { name: 'Báo vắng', url: '/absences', icon: FiRrHouseLeave },
  { name: 'Danh bạ', url: '/contacts', icon: BookUser },
  { name: 'Tài liệu', url: '/documents', icon: BookText },
  { name: 'Lịch trực', url: '/duty-schedule', icon: Calendar1 },
]

const Home = () => {
  const { data: events } = useFetch('/events')

  return (
    <AppWrapper
      title='Trang chủ'
      className={'flex flex-col gap-4'}
    >
      <p className='text-2xl font-bold'>What's up, guy!</p>
      <div className='flex flex-col gap-4'>
        <h3 className='leading-none font-semibold tracking-tight'>Sự kiện trong tuần</h3>
        {events && events.events.length > 0 ? (
          <div>
            {/* Tiêu đề */}
            <div className='grid grid-cols-4 items-center gap-2 border-b pb-2 font-semibold'>
              <label className='col-span-1 text-[14px] font-semibold'>Ngày</label>
              <label className='col-span-2'></label>
              <label className='col-span-1 text-right text-[14px] font-semibold'>Thời gian</label>
            </div>

            {/* Danh sách sự kiện */}
            {events.events
              .sort((a, b) => {
                const dateA = a.events && a.events.length > 0 ? new Date(a.events[0].date) : new Date()
                const dateB = b.events && b.events.length > 0 ? new Date(b.events[0].date) : new Date()
                return dateA - dateB
              })
              .map((dayEvent, index) => (
                <div
                  key={index}
                  className='mb-2'
                >
                  {dayEvent.events && dayEvent.events.length > 0 && (
                    <>
                      <div className='text-muted-foreground mb-1 border-b pb-1 text-sm font-medium'>
                        {dayEvent.dayOfWeek} - {format(dayEvent.events[0].date, 'dd/MM')}
                      </div>
                      {dayEvent.events
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .map((event) => (
                          <div
                            key={event.id}
                            className={cn(
                              'grid grid-cols-4 items-center gap-2 px-1 pb-2',
                              isToday(event.date) ? 'bg-muted/40' : isPast(event.date) && 'text-muted-foreground'
                            )}
                          >
                            <span className='col-span-1 text-xs'>#</span>
                            <h3 className='col-span-2'>{event.title}</h3>
                            <span className='col-span-1 text-right text-xs'>{format(event.date, 'HH:mm')}</span>
                          </div>
                        ))}
                    </>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <p className='text-muted-foreground text-center text-sm italic'>Bạn có một tuần rảnh rỗi (chưa triển khai)</p>
        )}
      </div>

      <div className='flex flex-col gap-4'>
        <h3 className='leading-none font-semibold tracking-tight'>Công cụ & Tài nguyên</h3>
        <div className='grid grid-cols-4 gap-3'>
          {tools.map((tool, index) => (
            <Link
              key={`tool${index}`}
              to={tool.url}
              className={cn(
                'hover:bg-muted/50 flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border p-2'
              )}
            >
              <tool.icon className='text-primary h-8 w-8' />
              <span className='line-clamp-1 text-center text-xs'>{tool.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </AppWrapper>
  )
}

export default Home
