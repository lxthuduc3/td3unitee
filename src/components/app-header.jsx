import { useNavigate } from 'react-router-dom'
import { getAbbreviationName } from '@/lib/utils'

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

  const user = {
    email: 'khiemnb153@gmail.com',
    familyName: 'Nguyễn Bính',
    givenName: 'Khiêm',
    avatar: 'https://github.com/shadcn.png',
  }

  return (
    <header className='sticky top-0 flex items-center justify-between border-b p-2'>
      <Button
        variant='ghost'
        size='icon'
        onClick={() => navigate(-1)}
        className='relative h-8 w-8 rounded-full'
      >
        <ChevronLeft className='h-6 w-6' />
        <span className='sr-only'>Quay lại</span>
      </Button>

      <h1 className='flex-1 text-center text-lg font-semibold'>{title}</h1>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='relative h-8 w-8 rounded-full'
          >
            <Avatar className='h-8 w-8'>
              <AvatarImage
                src={user?.image}
                alt='User avatar'
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
          <DropdownMenuItem className='cursor-pointer'>
            <LogOut className='h-4 w-4' />
            <span>Đăng xuất</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

export default AppHeader
