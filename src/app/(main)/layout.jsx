import AppNavbar from '@/components/app-navbar'
import AuthGuard from '@/components/auth-guard'

const MainLayout = ({ children }) => {
  return (
    <main className='flex h-screen w-screen flex-col'>
      <AuthGuard>
        {children}
        <AppNavbar />
      </AuthGuard>
    </main>
  )
}

export default MainLayout
