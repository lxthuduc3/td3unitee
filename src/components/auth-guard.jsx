import useAuth from '@/hooks/use-auth'
import { Navigate, useLocation } from 'react-router-dom'

const AuthGuard = ({ children }) => {
  const { user } = useAuth()

  const location = useLocation()

  if (!user) {
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
