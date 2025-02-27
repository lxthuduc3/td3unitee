import { ScrollArea } from '@/components/ui/scroll-area'
import AppHeader from './app-header'

const AppWrapper = ({ title, children, className }) => {
  return (
    <>
      <AppHeader title={title} />
      <ScrollArea className='h-[calc(100vh-128px)] w-screen flex-grow'>
        <div className={`w-full p-2 ${className}`}>{children}</div>
      </ScrollArea>
    </>
  )
}

export default AppWrapper
