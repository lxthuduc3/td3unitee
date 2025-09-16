import AppWrapper from '@/components/app-wrapper'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useFetch from '@/hooks/use-fetch'
import { getAbbreviationName } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

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
      className={'flex flex-col gap-4'}
    >
      {/* Lịch nấu cơm */}
      <div className='flex flex-col gap-4'>
        <h3 className='leading-none font-semibold tracking-tight'>Lịch nấu cơm</h3>
        {Object.keys(groupedCooking).length > 0 ? (
          <div className='grid gap-3'>
            {Object.entries(groupedCooking)
              .sort(([dayA], [dayB]) => parseInt(dayA) - parseInt(dayB))
              .map(([day, meals]) => (
                <Card
                  key={day}
                  className='w-full'
                >
                  <CardHeader>
                    <CardTitle className='text-base'>{getDayName(parseInt(day))}</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {/* Bữa trưa */}
                    {meals.lunch && (
                      <div>
                        <h4 className='mb-2 text-sm font-medium'>{getMealName('lunch')}</h4>
                        {meals.lunch.users?.length > 0 ? (
                          <div className='flex flex-wrap gap-3'>
                            {meals.lunch.users.map((user) => (
                              <div
                                key={user._id}
                                className='flex items-center gap-2'
                              >
                                <Avatar className='h-8 w-8'>
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback>{getAbbreviationName(user.givenName || 'User')}</AvatarFallback>
                                </Avatar>
                                <span className='text-sm'>
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

                    {/* Bữa tối */}
                    {meals.dinner && (
                      <div>
                        <h4 className='mb-2 text-sm font-medium'>{getMealName('dinner')}</h4>
                        {meals.dinner.users?.length > 0 ? (
                          <div className='flex flex-wrap gap-3'>
                            {meals.dinner.users.map((user) => (
                              <div
                                key={user._id}
                                className='flex items-center gap-2'
                              >
                                <Avatar className='h-8 w-8'>
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback>{getAbbreviationName(user.givenName || 'User')}</AvatarFallback>
                                </Avatar>
                                <span className='text-sm'>
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
          <p className='text-muted-foreground text-center text-sm italic'>Chưa có lịch nấu cơm</p>
        )}
      </div>

      {/* Lịch dọn dẹp */}
      <div className='flex flex-col gap-4'>
        <h3 className='leading-none font-semibold tracking-tight'>Lịch dọn vệ sinh</h3>
        {schedules?.schedules?.cleaning?.length > 0 ? (
          <Card className='w-full'>
            <CardContent className='space-y-4'>
              {schedules.schedules.cleaning.map((schedule) => (
                <div key={schedule._id}>
                  {schedule.users?.length > 0 ? (
                    <div className='flex flex-wrap gap-3'>
                      {schedule.users.map((user) => (
                        <div
                          key={user._id}
                          className='flex items-center gap-2'
                        >
                          <Avatar className='h-8 w-8'>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{getAbbreviationName(user.givenName || 'User')}</AvatarFallback>
                          </Avatar>
                          <span className='text-sm'>
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
            </CardContent>
          </Card>
        ) : (
          <p className='text-muted-foreground text-center text-sm italic'>Chưa có lịch dọn vệ sinh</p>
        )}
      </div>

      {/* Lịch đi chợ */}
      <div className='flex flex-col gap-4'>
        <h3 className='leading-none font-semibold tracking-tight'>Lịch đi chợ</h3>
        {schedules?.schedules?.shopping?.length > 0 ? (
          <Card className='w-full'>
            <CardContent className='space-y-4'>
              {schedules.schedules.shopping.map((schedule) => (
                <div key={schedule._id}>
                  {schedule.users?.length > 0 ? (
                    <div className='flex flex-wrap gap-3'>
                      {schedule.users.map((user) => (
                        <div
                          key={user._id}
                          className='flex items-center gap-2'
                        >
                          <Avatar className='h-8 w-8'>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{getAbbreviationName(user.givenName || 'User')}</AvatarFallback>
                          </Avatar>
                          <span className='text-sm'>
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
            </CardContent>
          </Card>
        ) : (
          <p className='text-muted-foreground text-center text-sm italic'>Chưa có lịch đi chợ</p>
        )}
      </div>

      {/* Công việc khác*/}
      <div className='flex flex-col gap-4'>
        <h3 className='leading-none font-semibold tracking-tight'>Công việc khác</h3>
        {schedules?.schedules?.other?.length > 0 ? (
          <Card className='w-full'>
            <CardContent className='space-y-4'>
              {schedules.schedules.other.map((schedule) => (
                <div
                  className='flex items-center gap-4'
                  key={schedule._id}
                >
                  <Badge variant='secondary'>{schedule.description}</Badge>
                  {schedule.users?.length > 0 ? (
                    <div className='flex flex-wrap gap-3'>
                      {schedule.users.map((user) => (
                        <div
                          key={user._id}
                          className='flex items-center gap-2'
                        >
                          <Avatar className='h-8 w-8'>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{getAbbreviationName(user.givenName || 'User')}</AvatarFallback>
                          </Avatar>
                          <span className='text-sm'>
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
            </CardContent>
          </Card>
        ) : (
          <p className='text-muted-foreground text-center text-sm italic'>Chưa có công việc khác nào</p>
        )}
      </div>
    </AppWrapper>
  )
}

export default DutySchedulePage
