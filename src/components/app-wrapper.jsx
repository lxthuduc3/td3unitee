'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import AppHeader from './app-header'

const AppWrapper = ({ title, children, className }) => {
  return (
    <>
      <AppHeader title={title} />
      <ScrollArea className='w-full flex-1'>
        <div className={`flex-grow p-2 ${className}`}>{children}</div>
      </ScrollArea>
    </>
  )
}

export default AppWrapper
