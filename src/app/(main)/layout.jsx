import AppNavbar from '@/components/app-navbar'
import AuthGuard from '@/components/auth-guard'
import { Toaster } from '@/components/ui/sonner'

const MainLayout = ({ children }) => {
  return (
    <main className='flex h-screen w-screen flex-col'>
      <Toaster position='top-center' />
      <AuthGuard>
        {children}
        <AppNavbar />
      </AuthGuard>
    </main>
  )
}

export default MainLayout
