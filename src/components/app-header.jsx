import { useNavigate } from 'react-router-dom'
import { getAbbreviationName } from '@/lib/utils'
import { getUser, unsetAuth } from '@/lib/auth'
import { googleLogout } from '@react-oauth/google'

import { ChevronLeft, User, Settings, LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link } from 'react-router-dom'

const AppHeader = ({ title }) => {
  const navigate = useNavigate()

  const user = getUser()

  return (
    <header className='glass-panel sticky top-0 z-40 flex items-center justify-between border-b p-2'>
      <Button
        variant='ghost'
        size='icon'
        onClick={() => navigate(-1)}
        className='relative h-9 w-9 rounded-full text-amber-800 transition-all hover:bg-amber-100/60 hover:text-amber-900 dark:text-amber-200 dark:hover:bg-amber-900/30'
      >
        <ChevronLeft className='h-5 w-5' />
        <span className='sr-only'>Quay lại</span>
      </Button>

      <h1 className='flex-1 text-center text-base font-bold tracking-wide text-amber-950 dark:text-amber-100'>
        {title}
      </h1>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='glow-ring relative h-9 w-9 rounded-full p-0 transition-all hover:scale-105'
          >
            <Avatar className='h-9 w-9'>
              <AvatarImage
                src={user?.avatar}
                alt={`Ảnh đại diện của ${user?.familyName} ${user?.givenName}`}
              />
              <AvatarFallback className='bg-gradient-to-br from-yellow-400 to-amber-500 text-xs font-bold text-white'>
                {getAbbreviationName(user?.givenName || 'U')}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='w-56'
          align='end'
          forceMount
        >
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col gap-1'>
              <p className='text-sm font-semibold'>
                {user?.familyName} {user?.givenName}
              </p>
              <p className='text-muted-foreground text-xs'>{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              to='/profile'
              className='cursor-pointer'
            >
              <User className='h-4 w-4' />
              <span>Hồ sơ</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              to='/settings'
              className='cursor-pointer'
            >
              <Settings className='h-4 w-4' />
              <span>Cài đặt</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400'
            onClick={() => {
              googleLogout()
              unsetAuth()
              navigate('/login')
            }}
          >
            <LogOut className='h-4 w-4' />
            <span>Đăng xuất</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

export default AppHeader
