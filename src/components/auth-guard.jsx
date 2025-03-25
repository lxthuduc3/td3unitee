import { getAuthStatus } from '@/lib/auth'
import { Navigate, useLocation } from 'react-router-dom'

const AuthGuard = ({ children }) => {
  const authStatus = getAuthStatus()

  const location = useLocation()

  if (authStatus == 'unauthenticated') {
    return (
      <Navigate
        to={`/login?callbackUrl=${location.pathname}`}
        replace
      />
    )
  }

  return children
}

export default AuthGuard
