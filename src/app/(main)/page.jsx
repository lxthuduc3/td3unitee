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
      className='flex flex-col gap-5'
    >
      {/* Hero Banner */}
      <div className='relative overflow-hidden rounded-3xl shadow-xl'>
        {/* Background gradient */}
        <div className='absolute inset-0 bg-gradient-to-br from-yellow-200 via-amber-300 to-yellow-300 dark:from-yellow-600 dark:via-amber-600 dark:to-yellow-700' />
        {/* Shimmer orbs */}
        <div className='absolute -top-6 -right-6 h-32 w-32 rounded-full bg-white/20 blur-2xl' />
        <div className='absolute -bottom-4 left-8 h-20 w-20 rounded-full bg-white/15 blur-xl' />
        {/* Glass overlay */}
        <div className='absolute inset-0 bg-gradient-to-b from-white/10 to-transparent' />
        {/* Content */}
        <div className='relative px-6 py-7'>
          <p className='mb-0.5 text-xs font-semibold uppercase tracking-widest text-amber-900/70 dark:text-yellow-200/70'>
            TD3 Unitee
          </p>
          <h1 className='mb-1 text-2xl font-extrabold text-amber-950 dark:text-white'>
            Chào mừng trở lại! 👋
          </h1>
          <p className='text-sm font-medium text-amber-800/80 dark:text-yellow-100/80'>
            Nơi kết nối anh em — mọi lúc, mọi nơi
          </p>
        </div>
      </div>

      {/* Tools Section */}
      <div className='glass-card rounded-3xl p-5'>
        <div className='mb-4 flex items-center gap-2.5'>
          <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 shadow-md shadow-amber-200/50 dark:shadow-amber-900/40'>
            <BookText className='h-4 w-4 text-white' />
          </div>
          <h2 className='text-sm font-bold tracking-wide text-amber-900 dark:text-amber-100'>
            Công cụ &amp; Tài nguyên
          </h2>
        </div>

        <div className='grid grid-cols-4 gap-3'>
          {tools.map((tool, index) => (
            <Link
              key={`tool${index}`}
              to={tool.url}
              className='group flex flex-col items-center gap-2 rounded-2xl p-3 text-center transition-all duration-200 hover:scale-105 active:scale-95'
            >
              <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 shadow-md shadow-amber-300/40 transition-all duration-200 group-hover:shadow-lg group-hover:shadow-amber-400/50 dark:from-yellow-500 dark:to-amber-600 dark:shadow-amber-700/30'>
                <tool.icon className='h-5 w-5 text-white' />
              </div>
              <span className='text-[11px] font-semibold leading-tight text-amber-900/80 group-hover:text-amber-900 dark:text-amber-200/80 dark:group-hover:text-amber-100'>
                {tool.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Events Section */}
      <div className='glass-card rounded-3xl p-5'>
        <div className='mb-4 flex items-center gap-2.5'>
          <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-400 shadow-md shadow-amber-200/50 dark:shadow-amber-900/40'>
            <Calendar1 className='h-4 w-4 text-white' />
          </div>
          <h2 className='text-sm font-bold tracking-wide text-amber-900 dark:text-amber-100'>
            Sự kiện trong tuần
          </h2>
        </div>

        {events && events.events.length > 0 ? (
          <div className='space-y-3'>
            {events.events
              .sort((a, b) => {
                const dateA = a.events && a.events.length > 0 ? new Date(a.events[0].date) : new Date()
                const dateB = b.events && b.events.length > 0 ? new Date(b.events[0].date) : new Date()
                return dateA - dateB
              })
              .map((dayEvent, index) => (
                <div key={index}>
                  {dayEvent.events && dayEvent.events.length > 0 && (
                    <div className='overflow-hidden rounded-2xl border border-amber-200/60 bg-amber-50/60 dark:border-amber-700/30 dark:bg-amber-950/30'>
                      {/* Day header */}
                      <div className='flex items-center gap-2 border-b border-amber-200/50 bg-gradient-to-r from-amber-100/80 to-yellow-100/50 px-4 py-2.5 dark:border-amber-700/30 dark:from-amber-900/40 dark:to-yellow-900/20'>
                        <span className='rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm dark:from-yellow-500 dark:to-amber-600'>
                          {dayEvent.dayOfWeek}
                        </span>
                        <span className='text-xs font-semibold text-amber-700 dark:text-amber-300'>
                          {format(dayEvent.events[0].date, 'dd/MM')}
                        </span>
                      </div>
                      {/* Events list */}
                      <div className='divide-y divide-amber-100/60 dark:divide-amber-800/30'>
                        {dayEvent.events
                          .sort((a, b) => new Date(a.date) - new Date(b.date))
                          .map((event) => (
                            <div
                              key={event.id}
                              className={cn(
                                'flex items-center justify-between px-4 py-3 transition-colors',
                                isToday(event.date)
                                  ? 'bg-yellow-100/80 dark:bg-yellow-800/20'
                                  : isPast(event.date)
                                    ? 'opacity-50'
                                    : 'hover:bg-amber-50/80 dark:hover:bg-amber-900/20'
                              )}
                            >
                              <div className='flex items-center gap-3'>
                                <div
                                  className={cn(
                                    'h-2 w-2 flex-shrink-0 rounded-full',
                                    isToday(event.date)
                                      ? 'bg-amber-500 shadow-sm shadow-amber-400'
                                      : isPast(event.date)
                                        ? 'bg-muted-foreground/40'
                                        : 'bg-amber-400'
                                  )}
                                />
                                <span className='text-sm font-medium text-amber-950 dark:text-amber-100'>
                                  {event.title}
                                </span>
                              </div>
                              <span className='rounded-lg bg-amber-100/80 px-2 py-0.5 font-mono text-xs font-semibold text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'>
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
          <div className='py-10 text-center'>
            <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-100 to-amber-100 shadow-inner dark:from-yellow-900/40 dark:to-amber-900/40'>
              <Calendar1 className='h-7 w-7 text-amber-500 dark:text-amber-400' />
            </div>
            <p className='font-semibold text-amber-900/70 dark:text-amber-200/70'>Tuần này rảnh rỗi</p>
            <p className='mt-1 text-xs text-amber-800/50 dark:text-amber-300/50'>Chưa có sự kiện nào được lên lịch</p>
          </div>
        )}
      </div>
    </AppWrapper>
  )
}

export default Home
