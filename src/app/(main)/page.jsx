import { getUser } from '@/lib/auth'
import { cn } from '@/lib/utils'

import { BookUser, CookingPot, ReceiptText, ShoppingCart, BookText } from 'lucide-react'
import FiRrHouseLeave from '@/components/flaticons/fi-rr-house-leave'
import FiRrSalad from '@/components/flaticons/fi-rr-salad'

import AppWrapper from '@/components/app-wrapper'
import { Link } from 'react-router-dom'

const tools = [
  { name: 'Nấu cơm', url: '/cooking', icon: CookingPot },
  { name: 'Đi chợ', url: '/shopping', icon: ShoppingCart },
  { name: 'Thực đơn', url: '/meals', icon: FiRrSalad },
  { name: 'XN tiền nhà', url: '/boarding-fees', icon: ReceiptText },
  { name: 'Báo vắng', url: '/absences', icon: FiRrHouseLeave },
  { name: 'Danh bạ', url: '/contacts', icon: BookUser },
  { name: 'Tài liệu', url: '/documents', icon: BookText },
]

const Home = () => {
  return (
    <AppWrapper
      title='Trang chủ'
      className={'flex flex-col gap-4'}
    >
      <p className='text-2xl font-bold'>What's up, guy!</p>
      <div className='flex flex-col gap-4'>
        <h3 className='leading-none font-semibold tracking-tight'>Sự kiện trong tuần</h3>
        <p className='text-muted-foreground text-center text-sm italic'>Bạn có một tuần rảnh rỗi (chưa triển khai)</p>
      </div>

      <div className='flex flex-col gap-4'>
        <h3 className='leading-none font-semibold tracking-tight'>Công cụ & Tài nguyên</h3>
        <div className='grid grid-cols-4 gap-3'>
          {tools.map((tool, index) => (
            <Link
              key={`tool${index}`}
              to={tool.url}
              className={cn(
                'hover:bg-muted/50 flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border p-2'
              )}
            >
              <tool.icon className='text-primary h-8 w-8' />
              <span className='line-clamp-1 text-center text-xs'>{tool.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </AppWrapper>
  )
}

export default Home
