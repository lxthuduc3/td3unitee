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
    <header className='sticky top-0 z-40 flex items-center justify-between border-b border-amber-300/70 bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 p-2 shadow-sm dark:border-amber-700/60 dark:from-amber-950 dark:via-yellow-900 dark:to-amber-900'>
      <Button
        variant='ghost'
        size='icon'
        onClick={() => navigate(-1)}
        className='relative h-8 w-8 rounded-full text-amber-950 hover:bg-white/35 dark:text-yellow-100 dark:hover:bg-white/10'
      >
        <ChevronLeft className='h-6 w-6' />
        <span className='sr-only'>Quay lại</span>
      </Button>

      <h1 className='flex-1 text-center text-lg font-bold text-amber-950 dark:text-yellow-100'>{title}</h1>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='relative h-8 w-8 rounded-full ring-2 ring-white/60 hover:bg-white/30 dark:ring-yellow-400/40'
          >
            <Avatar className='h-8 w-8'>
              <AvatarImage
                src={user?.avatar}
                alt={`Ảnh đại diển của ${user?.familyName} ${user?.givenName}`}
              />
              <AvatarFallback>{getAbbreviationName(user?.givenName || 'U')}</AvatarFallback>
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
              <p className='text-sm font-medium'>
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
            className='cursor-pointer'
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
