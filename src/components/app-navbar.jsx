import { cn } from '@/lib/utils'
import { Link, useLocation } from 'react-router-dom'
import { House, Utensils, Receipt, Bell } from 'lucide-react'

const navItems = [
  { name: 'Trang chủ', href: '/', icon: House },
  { name: 'ĐK cơm', href: '/meal-registration', icon: Utensils },
  { name: 'Báo chi', href: '/expense-report', icon: Receipt },
  { name: 'Thông báo', href: '/notifications', icon: Bell },
]

const AppNavbar = () => {
  const location = useLocation()

  return (
    <nav className='w-full border-t border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-black'>
      <ul className='grid grid-cols-4 gap-2 px-2 py-1'>
        {navItems.map((item, index) => {
          const active = item.href === '/' ? location.pathname === '/' : location.pathname.startsWith(item.href)

          return (
            <li key={`navItem${index}`}>
              <Link
                to={item.href}
                className={cn(
                  `text-black-600 dark:text-white-400 flex flex-col items-center rounded-xl px-3 py-2 text-center font-medium transition-colors hover:bg-yellow-100 dark:hover:bg-yellow-950`,
                  {
                    'bg-yellow-500 text-white shadow-md dark:bg-yellow-500 dark:text-black': active,
                  }
                )}
              >
                <item.icon className='mb-1 h-5 w-5' />
                <span className='text-xs whitespace-nowrap'>{item.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default AppNavbar
