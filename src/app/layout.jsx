import { GoogleOAuthProvider } from '@react-oauth/google'
import ThemeProvider from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'

const RootLayout = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_ID}>
      <div className='font-plus-jakarta-sans h-screen w-screen overflow-hidden pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] antialiased'>
        <ThemeProvider>
          <Toaster
            position='top-center'
            expand={true}
          />
          {children}
        </ThemeProvider>
      </div>
    </GoogleOAuthProvider>
  )
}

export default RootLayout
