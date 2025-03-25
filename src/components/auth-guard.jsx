import { getAuthStatus, getUser } from '@/lib/auth'
import { Navigate, useLocation } from 'react-router-dom'

const AuthGuard = ({ children }) => {
  const authStatus = getAuthStatus()
  const user = getUser()

  const location = useLocation()

  if (authStatus == 'unauthenticated') {
    return (
      <Navigate
        to={`/login?callbackUrl=${location.pathname}`}
        replace
      />
    )
  } else {
    if (user.status == 'pending') {
      return (
        <Navigate
          to={`/pending`}
          replace
        />
      )
    } else if (user.status == 'left') {
      return (
        <Navigate
          to={`/farewell`}
          replace
        />
      )
    }
  }

  return children
}

export default AuthGuard
