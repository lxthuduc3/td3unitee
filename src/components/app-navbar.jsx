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
    <nav className='bg-background w-full border-t'>
      <ul className='grid grid-cols-4 gap-3 px-2 py-1'>
        {navItems.map((item, index) => {
          const active = item.href === '/' ? location.pathname === '/' : location.pathname.startsWith(item.href)
          return (
            <li key={`navItem${index}`}>
              <Link
                to={item.href}
                className={cn(`text-primary flex flex-col items-center rounded-lg px-4 py-2 text-center font-semibold`, {
                  'bg-primary text-background shadow': active,
                })}
              >
                <item.icon />
                <span className='text-xs text-nowrap whitespace-nowrap'>{item.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default AppNavbar
