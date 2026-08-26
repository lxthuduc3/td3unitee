import { ScrollArea } from '@/components/ui/scroll-area'
import AppHeader from './app-header'

const AppWrapper = ({ title, children, className }) => {
  return (
    <>
      <AppHeader title={title} />
      <ScrollArea className='w-screen min-h-0 flex-1'>
        <div className={`min-h-full w-full p-3 sm:p-4 ${className || ''}`}>{children}</div>
      </ScrollArea>
    </>
  )
}

export default AppWrapper
