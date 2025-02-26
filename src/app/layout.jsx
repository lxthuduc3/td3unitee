import AuthProvider from '@/components/auth-provider'
import { GoogleOAuthProvider } from '@react-oauth/google'

const RootLayout = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_ID}>
      <div className='font-plus-jakarta-sans h-screen w-screen overflow-hidden antialiased'>
        <AuthProvider>{children}</AuthProvider>
      </div>
    </GoogleOAuthProvider>
  )
}

export default RootLayout
