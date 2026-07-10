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
    <header className='sticky top-0 z-40 flex items-center justify-between border-b border-amber-200 bg-amber-50/95 p-2 shadow-sm backdrop-blur-xl dark:border-amber-800/70 dark:bg-stone-950/95'>
      <Button
        variant='ghost'
        size='icon'
        onClick={() => navigate(-1)}
        className='relative h-8 w-8 rounded-full text-amber-900 hover:bg-yellow-100 dark:text-amber-100 dark:hover:bg-yellow-950'
      >
        <ChevronLeft className='h-6 w-6' />
        <span className='sr-only'>Quay lại</span>
      </Button>

      <h1 className='flex-1 text-center text-lg font-bold text-amber-950 dark:text-amber-100'>{title}</h1>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='relative h-8 w-8 rounded-full ring-2 ring-amber-300/70 hover:bg-yellow-100 dark:ring-amber-700/70 dark:hover:bg-yellow-950'
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
