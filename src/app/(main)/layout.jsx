import AppNavbar from '@/components/app-navbar'
import AuthGuard from '@/components/auth-guard'
import { Toaster } from '@/components/ui/sonner'
import NotificationProvider from '@/components/notification-provider'

const MainLayout = ({ children }) => {
  return (
    <main className='flex h-[calc(100vh-env(safe-area-inset-top)-env(safe-area-inset-bottom))] w-screen flex-col overflow-hidden'>
      <Toaster position='top-center' />
      <AuthGuard>
        <NotificationProvider>
          {children}
          <AppNavbar />
        </NotificationProvider>
      </AuthGuard>
    </main>
  )
}

export default MainLayout
