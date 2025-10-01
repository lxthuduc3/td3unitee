import AppWrapper from '@/components/app-wrapper'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useFetch from '@/hooks/use-fetch'
import { getAbbreviationName } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { NotepadText } from 'lucide-react'

const DutySchedulePage = () => {
  const { data: schedules } = useFetch('/duty-schedules', { suspense: true })

  const getDayName = (day) => {
    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']
    return days[day]
  }

  const getMealName = (meal) => {
    return meal === 'lunch' ? 'Bữa trưa' : 'Bữa tối'
  }

  // Nhóm schedules theo ngày
  const groupSchedulesByDay = (cookingSchedules) => {
    const grouped = {}
    cookingSchedules?.forEach((schedule) => {
      if (!grouped[schedule.day]) {
        grouped[schedule.day] = {}
      }
      grouped[schedule.day][schedule.meal] = schedule
    })
    return grouped
  }

  const groupedCooking = groupSchedulesByDay(schedules?.schedules?.cooking)

  return (
    <AppWrapper
      title='Lịch trực'
      className='min-h-screen bg-gray-50 dark:bg-black'
    >
      {/* Header Section */}
      <div className='mb-6 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 p-6 text-white shadow-lg dark:from-yellow-500 dark:to-amber-600'>
        <div className='mb-2 flex items-center gap-3'>
          <div className='rounded-xl bg-white/20 p-2'>
            <NotepadText />
          </div>
          <h1 className='text-xl font-bold'>Lịch trực </h1>
        </div>
        <p className='text-white/90'>Theo dõi lịch phân công công việc</p>
      </div>
      {/* Lịch nấu cơm */}
      <div className='mb-6 overflow-hidden rounded-2xl border border-yellow-200 bg-white shadow-lg dark:border-yellow-800 dark:bg-gray-800'>
        <div className='bg-gradient-to-r from-yellow-400 to-amber-500 p-4'>
          <h2 className='text-lg font-semibold text-white'>🍳 Lịch nấu cơm</h2>
        </div>

        <div className='p-4'>
          {Object.keys(groupedCooking).length > 0 ? (
            <div className='grid gap-4'>
              {Object.entries(groupedCooking)
                .sort(([dayA], [dayB]) => parseInt(dayA) - parseInt(dayB))
                .map(([day, meals]) => (
                  <Card
                    key={day}
                    className='border border-yellow-200 bg-yellow-50/50 transition-shadow hover:shadow-md dark:border-yellow-800 dark:bg-yellow-900/20'
                  >
                    <CardHeader className='pb-3'>
                      <CardTitle className='text-base text-yellow-700 dark:text-yellow-300'>
                        {getDayName(parseInt(day))}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      {/* Bữa trưa */}
                      {meals.lunch && (
                        <div>
                          <h4 className='mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>{getMealName('lunch')}</h4>
                          {meals.lunch.users?.length > 0 ? (
                            <div className='flex flex-wrap gap-2'>
                              {meals.lunch.users.map((user) => (
                                <div
                                  key={user._id}
                                  className='flex items-center gap-2 rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30'
                                >
                                  <Avatar className='h-6 w-6'>
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback className='text-xs'>
                                      {getAbbreviationName(user.givenName || 'User')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className='text-sm text-gray-700 dark:text-gray-300'>
                                    {user.familyName} {user.givenName}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className='text-muted-foreground text-sm italic'>Chưa có người được phân công</span>
                          )}
                        </div>
                      )}{' '}
                      {/* Bữa tối */}
                      {meals.dinner && (
                        <div>
                          <h4 className='mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>{getMealName('dinner')}</h4>
                          {meals.dinner.users?.length > 0 ? (
                            <div className='flex flex-wrap gap-2'>
                              {meals.dinner.users.map((user) => (
                                <div
                                  key={user._id}
                                  className='flex items-center gap-2 rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30'
                                >
                                  <Avatar className='h-6 w-6'>
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback className='text-xs'>
                                      {getAbbreviationName(user.givenName || 'User')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className='text-sm text-gray-700 dark:text-gray-300'>
                                    {user.familyName} {user.givenName}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className='text-muted-foreground text-sm italic'>Chưa có người được phân công</span>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <div className='py-8 text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800'>
                <svg
                  className='h-8 w-8 text-gray-400'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12.5 2C13.3 2 14 2.7 14 3.5S13.3 5 12.5 5 11 4.3 11 3.5 11.7 2 12.5 2M16.5 11H13L14.5 7.5C14.9 6.6 15.8 6 16.8 6S18.7 6.6 19.1 7.5L20.6 11H17.1L15.8 15L18.7 16.5C19.1 16.8 19.2 17.3 18.9 17.7C18.8 17.9 18.6 18 18.4 18C18.3 18 18.1 18 18 17.9L14.8 16.2L12.9 17.9C12.6 18.2 12.1 18.1 11.8 17.8C11.7 17.6 11.6 17.4 11.6 17.2C11.6 17 11.7 16.8 11.8 16.7L13.9 14.6L12.5 11H9C8.4 11 8 10.6 8 10S8.4 9 9 9H12.5C13.1 9 13.5 9.4 13.5 10V10L12.1 13.3L13.4 14.6L15.4 10H17.9L16.4 6.5C16.2 6.2 15.9 6 15.5 6S14.8 6.2 14.6 6.5L13.1 10H9.9L11.4 6.5C11.6 6.2 11.9 6 12.3 6S13 6.2 13.2 6.5L14.7 10H16.1L14.6 6.5C14.2 5.6 13.3 5 12.3 5S10.4 5.6 10 6.5L8.5 10H5.5C4.9 10 4.5 10.4 4.5 11S4.9 12 5.5 12H8.5L10 15.5C10.2 15.8 10.5 16 10.9 16S11.6 15.8 11.8 15.5L13.3 12H16.5C17.1 12 17.5 11.6 17.5 11S17.1 11 16.5 11Z' />
                </svg>
              </div>
              <p className='text-muted-foreground text-lg'>Chưa có lịch nấu cơm</p>
              <p className='text-muted-foreground/70 text-sm'>Liên hệ ban điều hành để được phân công</p>
            </div>
          )}
        </div>
      </div>{' '}
      {/* Lịch dọn dẹp */}
      <div className='mb-6 overflow-hidden rounded-2xl border border-yellow-200 bg-white shadow-lg dark:border-yellow-800 dark:bg-gray-800'>
        <div className='bg-gradient-to-r from-yellow-400 to-amber-500 p-4'>
          <h2 className='text-lg font-semibold text-white'>🧹 Lịch dọn vệ sinh</h2>
        </div>

        <div className='p-4'>
          {schedules?.schedules?.cleaning?.length > 0 ? (
            <div className='space-y-4'>
              {schedules.schedules.cleaning.map((schedule) => (
                <div key={schedule._id}>
                  {schedule.users?.length > 0 ? (
                    <div className='flex flex-wrap gap-2'>
                      {schedule.users.map((user) => (
                        <div
                          key={user._id}
                          className='flex items-center gap-2 rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30'
                        >
                          <Avatar className='h-6 w-6'>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className='text-xs'>{getAbbreviationName(user.givenName || 'User')}</AvatarFallback>
                          </Avatar>
                          <span className='text-sm text-gray-700 dark:text-gray-300'>
                            {user.familyName} {user.givenName}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className='text-muted-foreground text-sm italic'>Chưa có người được phân công</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className='py-8 text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800'>
                <svg
                  className='h-8 w-8 text-gray-400'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M19.36 2.72L20.78 4.14L19.36 5.56L17.95 4.14L19.36 2.72M12 8L10.5 9.5L9 8L7.5 9.5L9 11L10.5 9.5L12 11L13.5 9.5L12 8M12 2C13.11 2 14 2.9 14 4C14 5.11 13.11 6 12 6C10.89 6 10 5.11 10 4C10 2.9 10.89 2 12 2M21 10.5C21 11.33 20.33 12 19.5 12C18.67 12 18 11.33 18 10.5C18 9.67 18.67 9 19.5 9C20.33 9 21 9.67 21 10.5M17.5 3C18.33 3 19 3.67 19 4.5C19 5.33 18.33 6 17.5 6C16.67 6 16 5.33 16 4.5C16 3.67 16.67 3 17.5 3Z' />
                </svg>
              </div>
              <p className='text-muted-foreground text-lg'>Chưa có lịch dọn vệ sinh</p>
              <p className='text-muted-foreground/70 text-sm'>Liên hệ ban điều hành để được phân công</p>
            </div>
          )}
        </div>
      </div>
      {/* Lịch đi chợ */}
      <div className='mb-6 overflow-hidden rounded-2xl border border-yellow-200 bg-white shadow-lg dark:border-yellow-800 dark:bg-gray-800'>
        <div className='bg-gradient-to-r from-yellow-400 to-amber-500 p-4'>
          <h2 className='text-lg font-semibold text-white'>🛒 Lịch đi chợ</h2>
        </div>

        <div className='p-4'>
          {schedules?.schedules?.shopping?.length > 0 ? (
            <div className='space-y-3'>
              {schedules.schedules.shopping.map((schedule) => (
                <div key={schedule._id}>
                  {schedule.users?.length > 0 ? (
                    <div className='flex flex-wrap gap-2'>
                      {schedule.users.map((user) => (
                        <div
                          key={user._id}
                          className='flex items-center gap-2 rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30'
                        >
                          <Avatar className='h-6 w-6'>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className='text-xs'>{getAbbreviationName(user.givenName || 'User')}</AvatarFallback>
                          </Avatar>
                          <span className='text-sm text-gray-700 dark:text-gray-300'>
                            {user.familyName} {user.givenName}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className='text-muted-foreground text-sm italic'>Chưa có người được phân công</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className='py-8 text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800'>
                <svg
                  className='h-8 w-8 text-gray-400'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M7 4V2C7 1.45 7.45 1 8 1S9 1.45 9 2V4H15V2C15 1.45 15.45 1 16 1S17 1.45 17 2V4H20C21.11 4 22 4.89 22 6V20C22 21.11 21.11 22 20 22H4C2.9 22 2 21.11 2 20V6C2 4.89 2.9 4 4 4H7M4 8V20H20V8H4M12 9L17 14H14V18H10V14H7L12 9Z' />
                </svg>
              </div>
              <p className='text-muted-foreground text-lg'>Chưa có lịch đi chợ</p>
              <p className='text-muted-foreground/70 text-sm'>Liên hệ ban điều hành để được phân công</p>
            </div>
          )}
        </div>
      </div>
      {/* Công việc khác*/}
      <div className='overflow-hidden rounded-2xl border border-yellow-200 bg-white shadow-lg dark:border-yellow-800 dark:bg-gray-800'>
        <div className='bg-gradient-to-r from-yellow-400 to-amber-500 p-4'>
          <h2 className='text-lg font-semibold text-white'>⚡ Công việc khác</h2>
        </div>

        <div className='p-4'>
          {schedules?.schedules?.other?.length > 0 ? (
            <div className='space-y-3'>
              {schedules.schedules.other.map((schedule) => (
                <div
                  key={schedule._id}
                  className='flex items-start gap-3'
                >
                  <Badge className='shrink-0 bg-yellow-500 text-white'>{schedule.description}</Badge>
                  <div className='flex-1'>
                    {schedule.users?.length > 0 ? (
                      <div className='flex flex-wrap gap-2'>
                        {schedule.users.map((user) => (
                          <div
                            key={user._id}
                            className='flex items-center gap-2 rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30'
                          >
                            <Avatar className='h-6 w-6'>
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback className='text-xs'>
                                {getAbbreviationName(user.givenName || 'User')}
                              </AvatarFallback>
                            </Avatar>
                            <span className='text-sm text-gray-700 dark:text-gray-300'>
                              {user.familyName} {user.givenName}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className='text-muted-foreground text-sm italic'>Chưa có người được phân công</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='py-8 text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800'>
                <svg
                  className='h-8 w-8 text-gray-400'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z' />
                </svg>
              </div>
              <p className='text-muted-foreground text-lg'>Chưa có công việc khác</p>
              <p className='text-muted-foreground/70 text-sm'>Các công việc đặc biệt sẽ xuất hiện tại đây</p>
            </div>
          )}
        </div>
      </div>
    </AppWrapper>
  )
}

export default DutySchedulePage
