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
      className={
        'flex flex-col gap-6 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20'
      }
    >
      {/* Header Section */}
      <div className='relative flex items-center justify-between overflow-hidden rounded-2xl shadow-lg'>
        <div className='absolute inset-0 bg-gradient-to-r from-yellow-300 to-amber-400 dark:from-yellow-500 dark:to-amber-600' />
        <div className='absolute inset-0 bg-white/20 dark:bg-black/30' />
        <div className='relative p-6'>
          <h1 className='mb-2 text-xl font-bold text-amber-900 dark:text-yellow-100'>Chào mừng trở lại! 👋</h1>
          <p className='text-lg text-amber-700 dark:text-yellow-200'>TD3 Unitee - Nơi kết nối anh em</p>
        </div>
      </div>

      {/* Events Section */}
      <div className='bg-card rounded-2xl border border-yellow-200 p-6 shadow-sm dark:border-yellow-800'>
        <div className='mb-6 flex items-center gap-3'>
          <div className='rounded-lg bg-yellow-400 p-2 dark:bg-yellow-500'>
            <Calendar1 className='h-6 w-6 text-white' />
          </div>
          <h2 className='text-foreground text-l font-bold'>Sự kiện trong tuần</h2>
        </div>

        {events && events.events.length > 0 ? (
          <div className='space-y-4'>
            {events.events
              .sort((a, b) => {
                const dateA = a.events && a.events.length > 0 ? new Date(a.events[0].date) : new Date()
                const dateB = b.events && b.events.length > 0 ? new Date(b.events[0].date) : new Date()
                return dateA - dateB
              })
              .map((dayEvent, index) => (
                <div key={index}>
                  {dayEvent.events && dayEvent.events.length > 0 && (
                    <div className='rounded-xl border-l-4 border-yellow-400 bg-yellow-50 p-4 dark:border-yellow-500 dark:bg-yellow-950/30'>
                      <div className='mb-3 flex items-center gap-2 font-semibold text-yellow-700 dark:text-yellow-300'>
                        <span className='rounded-full bg-yellow-400 px-2 py-1 text-sm text-white dark:bg-yellow-500'>
                          {dayEvent.dayOfWeek}
                        </span>
                        <span>{format(dayEvent.events[0].date, 'dd/MM')}</span>
                      </div>
                      <div className='space-y-2'>
                        {dayEvent.events
                          .sort((a, b) => new Date(a.date) - new Date(b.date))
                          .map((event) => (
                            <div
                              key={event.id}
                              className={cn(
                                'flex items-center justify-between rounded-lg p-3 transition-colors',
                                isToday(event.date)
                                  ? 'bg-yellow-200 text-yellow-800 shadow-sm dark:bg-yellow-800/40 dark:text-yellow-200'
                                  : isPast(event.date)
                                    ? 'bg-muted text-muted-foreground'
                                    : 'bg-background text-foreground hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                              )}
                            >
                              <div className='flex items-center gap-3'>
                                <div
                                  className={cn(
                                    'h-2 w-2 rounded-full',
                                    isToday(event.date) ? 'bg-yellow-500' : 'bg-muted-foreground'
                                  )}
                                />
                                <span className='font-medium'>{event.title}</span>
                              </div>
                              <span className='bg-muted rounded px-2 py-1 font-mono text-sm'>
                                {format(event.date, 'HH:mm')}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <div className='py-12 text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/40'>
              <Calendar1 className='h-8 w-8 text-yellow-600 dark:text-yellow-400' />
            </div>
            <p className='text-muted-foreground text-lg'>Bạn có một tuần rảnh rỗi</p>
            <p className='text-muted-foreground/70 text-sm'>Chưa có sự kiện nào được lên lịch</p>
          </div>
        )}
      </div>

      {/* Tools Section */}
      <div className='bg-card rounded-2xl border border-yellow-200 p-6 shadow-sm dark:border-yellow-800'>
        <div className='mb-6 flex items-center gap-3'>
          <div className='rounded-lg bg-amber-400 p-2 dark:bg-amber-500'>
            <BookText className='h-6 w-6 text-white' />
          </div>
          <h2 className='text-foreground text-l font-bold'>Công cụ & Tài nguyên</h2>
        </div>

        <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
          {tools.map((tool, index) => (
            <Link
              key={`tool${index}`}
              to={tool.url}
              className='group rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 p-4 transition-all duration-200 hover:scale-105 hover:border-yellow-300 hover:from-yellow-100 hover:to-amber-100 hover:shadow-md dark:border-yellow-800 dark:from-yellow-950/20 dark:to-amber-950/20 dark:hover:border-yellow-600 dark:hover:from-yellow-900/40 dark:hover:to-amber-900/40'
            >
              <div className='flex flex-col items-center space-y-3 text-center'>
                <div className='rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400 p-3 transition-transform duration-200 group-hover:scale-110 dark:from-yellow-500 dark:to-amber-500'>
                  <tool.icon className='h-6 w-6 text-white' />
                </div>
                <span className='text-foreground group-hover:text-foreground/90 text-sm font-medium'>{tool.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppWrapper>
  )
}

export default Home
