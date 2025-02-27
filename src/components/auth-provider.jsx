import { useState } from 'react'
import AuthContext from '@/contexts/auth'

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      return storedUser ? JSON.parse(storedUser) : null
    }
  })

  const [tokens, setTokens] = useState(() => {
    const storedTokens = localStorage.getItem('tokens')
    if (storedTokens) {
      return storedTokens ? JSON.parse(storedTokens) : null
    }
  })

  const login = ({ user, tokens }) => {
    setUser(user)
    setTokens(tokens)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('tokens', JSON.stringify(tokens))
  }

  const mutate = ({ user, tokens }) => {
    if (user) {
      setUser(user)
      localStorage.setItem('user', JSON.stringify(user))
    }
    if (tokens) {
      setTokens(tokens)
      localStorage.setItem('tokens', JSON.stringify(tokens))
    }
  }

  const logout = () => {
    setUser(null)
    setTokens(null)
    localStorage.removeItem('user')
    localStorage.removeItem('tokens')
  }

  return <AuthContext.Provider value={{ tokens, user, mutate, login, logout }}>{children}</AuthContext.Provider>
}

export default AuthProvider
