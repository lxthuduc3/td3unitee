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
    <nav className='w-full border-t border-amber-200 bg-amber-50/95 shadow-[0_-6px_20px_rgba(180,120,20,0.08)] backdrop-blur-xl dark:border-amber-800/70 dark:bg-stone-950/95'>
      <ul className='grid grid-cols-4 gap-2 px-2 py-1'>
        {navItems.map((item, index) => {
          const active = item.href === '/' ? location.pathname === '/' : location.pathname.startsWith(item.href)

          return (
            <li key={`navItem${index}`}>
              <Link
                to={item.href}
                className={cn(
                  `flex flex-col items-center rounded-xl px-3 py-2 text-center font-medium text-amber-900 transition-all hover:bg-yellow-100 dark:text-amber-100 dark:hover:bg-yellow-950`,
                  {
                    'bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-950 shadow-md shadow-amber-300/30 dark:from-yellow-500 dark:to-amber-500 dark:text-stone-950': active,
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
