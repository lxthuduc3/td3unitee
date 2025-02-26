import useAuth from '@/hooks/use-auth'
import { Navigate, useLocation } from 'react-router-dom'

const AuthGuard = ({ children }) => {
  const { tokens, user } = useAuth()

  const location = useLocation()

  if (!tokens || !user) {
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
