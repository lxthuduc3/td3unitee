import AppNavbar from '@/components/app-navbar'
import AuthGuard from '@/components/auth-guard'

import NotificationProvider from '@/components/notification-provider'

const MainLayout = ({ children }) => {
  return (
    <main className='flex h-screen w-screen flex-col overflow-hidden'>
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
