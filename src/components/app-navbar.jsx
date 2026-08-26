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
    <nav className='glass-panel w-full border-t pb-[env(safe-area-inset-bottom)]'>
      <ul className='grid grid-cols-4 gap-1 px-2 py-1.5'>
        {navItems.map((item, index) => {
          const active = item.href === '/' ? location.pathname === '/' : location.pathname.startsWith(item.href)

          return (
            <li key={`navItem${index}`}>
              <Link
                to={item.href}
                className={cn(
                  'flex flex-col items-center rounded-2xl px-2 py-2 text-center font-medium transition-all duration-200',
                  active
                    ? 'bg-gradient-to-b from-yellow-400 to-amber-500 text-white shadow-lg shadow-amber-400/40 dark:from-yellow-500 dark:to-amber-600 dark:shadow-amber-500/30'
                    : 'text-amber-800/70 hover:bg-amber-100/60 hover:text-amber-900 dark:text-amber-300/60 dark:hover:bg-amber-900/20 dark:hover:text-amber-200'
                )}
              >
                <item.icon className={cn('h-5 w-5 transition-transform duration-200', active ? 'mb-0.5 scale-110' : 'mb-0.5')} />
                <span className='text-[10px] font-semibold whitespace-nowrap'>{item.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default AppNavbar
